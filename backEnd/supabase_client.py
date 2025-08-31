import requests
import os
from typing import Dict, Any, List, Optional
import json
from dotenv import load_dotenv

load_dotenv()

class SupabaseClient:
    """HTTP-based Supabase client without Rust dependencies"""
    
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_KEY")
        
        if not self.url or not self.key:
            raise RuntimeError("❌ Supabase credentials not set in .env")
            
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
    
    def table(self, table_name: str):
        return SupabaseTable(self.url, table_name, self.headers)

class SupabaseTable:
    def __init__(self, url: str, table_name: str, headers: Dict[str, str]):
        self.base_url = f"{url}/rest/v1/{table_name}"
        self.headers = headers
    
    def select(self, columns: str = "*"):
        return SupabaseQuery(self.base_url, self.headers, "GET", columns)
    
    def insert(self, data: Dict[str, Any]):
        response = requests.post(self.base_url, json=data, headers=self.headers)
        return SupabaseResponse(response)
    
    def update(self, data: Dict[str, Any]):
        return SupabaseUpdate(self.base_url, self.headers, data)
    
    def delete(self):
        return SupabaseDelete(self.base_url, self.headers)

class SupabaseQuery:
    def __init__(self, url: str, headers: Dict[str, str], method: str, columns: str = "*"):
        self.url = url
        self.headers = headers
        self.method = method
        self.params = {"select": columns} if columns != "*" else {}
    
    def eq(self, column: str, value: Any):
        self.params[column] = f"eq.{value}"
        return self
    
    def neq(self, column: str, value: Any):
        self.params[column] = f"neq.{value}"
        return self
    
    def gt(self, column: str, value: Any):
        self.params[column] = f"gt.{value}"
        return self
    
    def gte(self, column: str, value: Any):
        self.params[column] = f"gte.{value}"
        return self
    
    def lt(self, column: str, value: Any):
        self.params[column] = f"lt.{value}"
        return self
    
    def lte(self, column: str, value: Any):
        self.params[column] = f"lte.{value}"
        return self
    
    def like(self, column: str, pattern: str):
        self.params[column] = f"like.{pattern}"
        return self
    
    def order(self, column: str, ascending: bool = True):
        self.params["order"] = f"{column}.{'asc' if ascending else 'desc'}"
        return self
    
    def limit(self, count: int):
        self.params["limit"] = str(count)
        return self
    
    def execute(self):
        response = requests.get(self.url, params=self.params, headers=self.headers)
        return SupabaseResponse(response)

class SupabaseUpdate:
    def __init__(self, url: str, headers: Dict[str, str], data: Dict[str, Any]):
        self.url = url
        self.headers = headers
        self.data = data
        self.params = {}
    
    def eq(self, column: str, value: Any):
        self.params[column] = f"eq.{value}"
        return self
    
    def execute(self):
        response = requests.patch(self.url, json=self.data, params=self.params, headers=self.headers)
        return SupabaseResponse(response)

class SupabaseDelete:
    def __init__(self, url: str, headers: Dict[str, str]):
        self.url = url
        self.headers = headers
        self.params = {}
    
    def eq(self, column: str, value: Any):
        self.params[column] = f"eq.{value}"
        return self
    
    def execute(self):
        response = requests.delete(self.url, params=self.params, headers=self.headers)
        return SupabaseResponse(response)

class SupabaseResponse:
    def __init__(self, response: requests.Response):
        self.status_code = response.status_code
        try:
            self.data = response.json() if response.text else []
        except:
            self.data = []
        
        # Handle single item responses
        if isinstance(self.data, dict):
            self.data = [self.data]

# Create a global client instance
supabase = SupabaseClient()
