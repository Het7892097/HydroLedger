import httpx
import os
from typing import Dict, Any
import json

class SimpleSupabaseClient:
    """Lightweight Supabase client using httpx instead of the full supabase library"""
    
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_KEY")
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
    
    def table(self, table_name: str):
        return SimpleSupabaseTable(self.url, table_name, self.headers)

class SimpleSupabaseTable:
    def __init__(self, url: str, table_name: str, headers: Dict[str, str]):
        self.base_url = f"{url}/rest/v1/{table_name}"
        self.headers = headers
    
    def select(self, columns: str = "*"):
        return SimpleSupabaseQuery(self.base_url, self.headers, "GET", columns)
    
    def insert(self, data: Dict[str, Any]):
        with httpx.Client() as client:
            response = client.post(self.base_url, json=data, headers=self.headers)
            return SimpleSupabaseResponse(response)
    
    def update(self, data: Dict[str, Any]):
        with httpx.Client() as client:
            response = client.patch(self.base_url, json=data, headers=self.headers)
            return SimpleSupabaseResponse(response)

class SimpleSupabaseQuery:
    def __init__(self, url: str, headers: Dict[str, str], method: str, columns: str = "*"):
        self.url = url
        self.headers = headers
        self.method = method
        self.params = {"select": columns} if columns != "*" else {}
    
    def eq(self, column: str, value: Any):
        self.params[column] = f"eq.{value}"
        return self
    
    def execute(self):
        with httpx.Client() as client:
            response = client.get(self.url, params=self.params, headers=self.headers)
            return SimpleSupabaseResponse(response)

class SimpleSupabaseResponse:
    def __init__(self, response: httpx.Response):
        self.status_code = response.status_code
        try:
            self.data = response.json() if response.text else []
        except:
            self.data = []
