#!/usr/bin/env python3

import uvicorn
from main import app

if __name__ == "__main__":
    # Render uses the PORT environment variable
    import os
    port = int(os.environ.get("PORT", 8000))
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
