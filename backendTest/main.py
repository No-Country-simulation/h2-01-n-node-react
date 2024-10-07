from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import pyodbc

app=FastAPI()


def get_db_connection():
    conn=pyodbc.connect(
        "DRIVER={MySQL ODBC 9.0 Unicode Driver};"
        "SERVER=localhost:3306;"
        "DATABASE=wakidb;"
        "UID=root;"
        "PWD=root;"
    )
    return conn

#division
class DivisionBase(BaseModel):
    nombre:str
    #image:str

class DivisionResponse(DivisionBase):
    id:int

#Endpoint
@app.get("/divisiones", response_model=list[DivisionResponse])
def read_divisiones():
    conn=get_db_connection()
    cursor=conn.cursor()
    cursor.execute("SELECT id, nombre FROM wakidb.division")
    divisiones=cursor.fetchall()        
    conn.close()
    return [{"id":row[0], "nombre":row[1]} for row in divisiones]
