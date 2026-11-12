"""Disposable local server smoke test. Never run against a production database."""
import http.cookiejar, json, sys, urllib.request, urllib.error
from pathlib import Path
from urllib.parse import urlparse
base=sys.argv[1].rstrip('/')
if urlparse(base).hostname not in ('localhost','127.0.0.1'):raise SystemExit('Only local test servers are allowed.')
key=Path(sys.argv[2]).read_text().strip()
jar=http.cookiejar.CookieJar(); client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar));checks=0;csrf=''
def req(path,method='GET',body=None,raw=None,origin=None,content_type='application/json'):
 data=raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
 headers={'Content-Type':content_type,'X-CSRF-Token':csrf,'Origin':origin or base}
 request=urllib.request.Request(base+path,data=data,headers=headers,method=method)
 try:r=client.open(request)
 except urllib.error.HTTPError as error:r=error
 payload=r.read()
 try:payload=json.loads(payload)
 except ValueError:pass
 return r.status,payload,r.headers

def expect(condition,name):
 global checks
 if not condition:raise AssertionError(name)
 checks+=1
s,p,h=req('/');expect(s==200 and b'TRIA' in p,'login HTML');expect('frame-ancestors' in h['Content-Security-Policy'],'CSP')
for path in ['/admin','/invite','/setup']:expect(req(path)[0]==200,'UI route '+path)
for path in ['/workflow-app/config.php','/.env','/.user.ini','/../workflow-app/app.php']:expect(req(path)[0]==404,'private route '+path)
expect(req('/api/login','POST',raw=b'[]')[0]==400,'reject JSON arrays')
expect(req('/api/login','POST',raw=b'{')[0]==400,'reject malformed JSON')
expect(req('/api/login','POST',body={},content_type='text/plain')[0]==415,'reject wrong content type')
setup={'setup_key':key,'email':'smoke@eksioglutria.com','name':'HTTP Test','password':'Temporary-test-123!'}
expect(req('/api/install','POST',setup)[0]==201,'install over HTTP')
expect(req('/api/state')[0]==401,'anonymous access')
expect(req('/api/install','POST',setup)[0]==409,'installer replay')
s,p,h=req('/api/login','POST',{'email':setup['email'],'password':setup['password'],'admin':True,'remember':True})
expect(s==200,'login over HTTP');expect('HttpOnly' in h['Set-Cookie'] and 'Max-Age=' in h['Set-Cookie'],'cookie attributes');csrf=p['csrf'];uid=p['user']['id']
expect(req('/api/state')[0]==200,'session cookie accepted')
expect(req('/api/projects','POST',{'name':'A','location':'B'},origin='https://evil.test')[0]==403,'origin protection')
s,p,_=req('/api/projects','POST',{'name':'HTTP Projesi','location':'Kartal'});expect(s==201,'project create');pid=p['id']
s,p,_=req('/api/tasks','POST',{'title':'HTTP görevi','project_id':pid,'assignee':uid,'due':'2026-11-20'});expect(s==201,'task create');tid=p['id']
expect(req('/api/tasks/'+tid,'PATCH',{'status':'Tamamlandı'})[0]==200,'task update')
import base64
s,p,_=req('/api/documents','POST',{'name':'test.txt','project_id':pid,'content':base64.b64encode(b'HTTP document').decode()});expect(s==201,'upload')
s,p,h=req('/api/documents/'+p['id']);expect(s==200 and p==b'HTTP document','download exact bytes');expect('attachment' in h['Content-Disposition'],'attachment header')
expect(req('/api/logout','POST',{})[0]==200,'logout');expect(req('/api/state')[0]==401,'session revoked')
print(f'OK: {checks} HTTP checks passed')
