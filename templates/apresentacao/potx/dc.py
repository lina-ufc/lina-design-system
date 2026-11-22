import socket,json,sys
def q(m,p=None,port=7980):
    s=socket.create_connection(('127.0.0.1',port),timeout=60)
    s.sendall((json.dumps({"id":1,"method":m,**({"params":p} if p is not None else {})})+"\n").encode())
    b=b""
    while not b.endswith(b"\n"):
        c=s.recv(1<<20)
        if not c: break
        b+=c
    s.close(); return json.loads(b) if b.strip() else None
if __name__=="__main__":
    r=q(sys.argv[1], json.loads(sys.argv[2]) if len(sys.argv)>2 else None)
    print(json.dumps(r,ensure_ascii=False)[:3000])
