# Builds src/data/lore.json from the wiki page data (run with: python3 -I tools/build_lore.py wiki.html)
import re,json,sys,html,difflib
h=open(sys.argv[1],encoding='utf-8').read()
D,_=json.JSONDecoder().raw_decode(h[h.find('const D=')+8:])
chars=json.load(open('src/data/netsu.json',encoding='utf-8'))
strip=lambda s: html.unescape(re.sub(r'<[^>]+>','',s))
norm=lambda s: re.sub(r'[^a-z ]','',s.lower())
byfirst={}
for c in chars: byfirst.setdefault(norm(c['name']).split()[0],[]).append(c)
SLUG={'alice':'alice','man-in-black':'heuey-engandar','becky':'rebecca-bonbon','grandmaster':'elaneer-lockett','dawn':'melia-dawn','tobias-l':'tobias-lysander','nina':'nina-reise-arnor','nixi':'nixi','naoto':'naoto','noelle':'noelle-ingram','gideon':'gideon-rosenberg'}
byid={c['id']:c for c in chars}
def find(name):
    n=norm(name); best=None;bs=0
    for c in sorted(chars,key=lambda c:-len(c['name'])):
        m=norm(c['name']).strip()
        if len(m.split())>=2 and (m in n or n in m): return c
    for c in chars:
        r=difflib.SequenceMatcher(None,n,norm(c['name'])).ratio()
        if r>bs: bs=r;best=c
    return best if bs>0.84 else None
STOP={'the','reise','man','black','witch','end','and','from','with','other','girl','boy','great','seal'}
META=re.compile(r'your confirmation|the table|transcript|art only|still open|the record|best effort',re.I)
def sentences(t):
    t=re.sub(r'\s+',' ',t).strip()
    t=re.sub(r'\b(St|Mr|Mrs|Dr|Lt|Prof)\.\s',r'\1.~',t)
    parts=re.split(r'(?<=[.!?])\s+(?=[A-Z"“])',t)
    return [p.strip().replace('.~','. ') for p in parts if p.strip()]
def redact(s,c,extra=()):
    words=set()
    for w in re.split(r"[\s]+",c['name'].replace("''",' ').replace('"',' ')):
        w=w.strip(".,()'")
        if len(w)>=3 and w.lower() not in STOP: words.add(w)
    for e in extra:
        e=e.strip(' "“”.,')
        if len(e)>=3 and e.lower() not in STOP: words.add(e)
    for w in sorted(words,key=len,reverse=True):
        s=re.sub(r"\b"+re.escape(w)+r"(?:'s)?\b",'█████',s,flags=re.I)
    return re.sub(r'(█████[\s.,]*)+█████','█████',s)
lore={}
def add(c,sents,aka=(),minlen=35,minwords=7):
    out=[]
    for s in sents:
        r=redact(s,c,aka)
        if minlen<=len(r)<=280 and r.count('█████')<=3 and r not in out and not META.search(r) and len(r.split())>=minwords: out.append(r)
    if not out: return
    if len(out)>6:
        intro=out[0]; rest=out[1:]
        step=(len(rest)-1)/4
        picked=[rest[round(i*step)] for i in range(5)]
        out=picked[::-1]+[intro]
    else:
        out=out[1:][::-1]+[out[0]]
    lore[c['id']]=out
GROUPS={'thors-students','thors-staff','church-others','royals-others','families','crossbell','north','towns','unplaced'}
miss=[]
for w in D['chars']:
    if w['slug'] in GROUPS:
        for li in re.findall(r'<li>(.*?)</li>',w['html'],flags=re.S):
            names=re.findall(r'<strong>(.*?)</strong>',li)
            if len(names)!=1: continue
            nm=strip(names[0]).strip(' .')
            if re.search(r' and |,',nm): continue
            rest=strip(li.split('</strong>',1)[1]).strip()
            key=norm(nm).split()
            c=find(nm) or (byfirst[key[-1]][0] if key and len(byfirst.get(key[-1],[]))==1 else None) or (byfirst[key[0]][0] if key and len(byfirst.get(key[0],[]))==1 else None)
            if c and c['id'] not in lore: add(c,sentences(rest),[nm]+nm.split(),minlen=12,minwords=2)
            elif not c: miss.append(nm)
        continue
    c=byid.get(SLUG.get(w['slug'])) or find(w['name'])
    if not c: miss.append(w['name']); continue
    aka=[a for k,v in w['info'] if k=='Also known as' for a in re.split(r';|\(|\)',strip(v))]
    body=re.sub(r'<h[23][^>]*>.*?</h[23]>',' ',w['html'],flags=re.S)
    sents=[]
    for para in re.findall(r'<p>(.*?)</p>',body,flags=re.S): sents+=sentences(strip(para))
    add(c,sents,aka+[w['name']]+w['name'].split())
json.dump(lore,open('src/data/lore.json','w',encoding='utf-8'),indent=1,ensure_ascii=False)
import collections
print('lore chars',len(lore),collections.Counter(len(v) for v in lore.values()))
print('unmatched wiki entries:',miss)
for k in ['olan-ohare','fraxis','heuey-engandar','alice','vita-r-khemia','marie-aegir','mitch-wiggins','prince-albert','dantes-growler','lotte-cappuchino','tobias','yan-vander']:
    print(k,json.dumps(lore.get(k),ensure_ascii=False,indent=0)[:1500])
