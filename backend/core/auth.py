import json
import logging
from typing import Optional
from urllib.request import urlopen

from jose import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from core.config import config as settings

logger = logging.getLogger(__name__)

class TokenPayload(BaseModel):
    sub: str
    email: Optional[str] = None
    name: Optional[str] = None

class VerifyToken:
    """Does all the token verification logic."""

    def __init__(self):
        self.config = {
            "DOMAIN": settings.AUTH0_DOMAIN,
            "API_AUDIENCE": settings.AUTH0_AUDIENCE,
            "ISSUER": f"https://{settings.AUTH0_DOMAIN}/",
            "ALGORITHMS": ["RS256"],
        }
        
        # This can be cached in a real-world scenario
        jwks_url = f"https://{self.config['DOMAIN']}/.well-known/jwks.json"
        self.jwks = json.loads(urlopen(jwks_url).read())

    def verify(self, token: str) -> TokenPayload:
        try:
            unverified_header = jwt.get_unverified_header(token)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token header",
            ) from e

        rsa_key = {}
        for key in self.jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
        
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=self.config["ALGORITHMS"],
                    audience=self.config["API_AUDIENCE"],
                    issuer=self.config["ISSUER"],
                )
            except jwt.ExpiredSignatureError:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token expired",
                )
            except jwt.JWTClaimsError:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid claims, please check the audience and issuer",
                )
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Unable to parse authentication token: {str(e)}",
                )

            return TokenPayload(**payload)
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to find appropriate key",
        )

auth_scheme = HTTPBearer()

def get_current_user(token: HTTPAuthorizationCredentials = Depends(auth_scheme)) -> TokenPayload:
    """Dependency to get the current authenticated user."""
    # Note: In a production app, you'd want to cache the JWKS or the VerifyToken instance
    verify_token = VerifyToken()
    return verify_token.verify(token.credentials)
