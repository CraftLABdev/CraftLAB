import os
import base58
import httpx
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from solders.keypair import Keypair

RPC = os.getenv("SOLANA_RPC", "https://api.mainnet-beta.solana.com")
SALT = b"craftlab-salt-v1"


def derive_key(password: str) -> bytes:
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=SALT, iterations=260_000)
    return kdf.derive(password.encode())


def encrypt_key(private_key_bytes: bytes, password: str) -> str:
    key = derive_key(password)
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    ct = aesgcm.encrypt(nonce, private_key_bytes, None)
    return base58.b58encode(nonce + ct).decode()


def decrypt_key(encrypted: str, password: str) -> bytes:
    key = derive_key(password)
    aesgcm = AESGCM(key)
    raw = base58.b58decode(encrypted)
    nonce, ct = raw[:12], raw[12:]
    return aesgcm.decrypt(nonce, ct, None)


def generate_wallet() -> tuple[str, bytes]:
    """Returns (public_key_str, private_key_bytes)."""
    kp = Keypair()
    return str(kp.pubkey()), bytes(kp)


def import_wallet(private_key_b58: str) -> tuple[str, bytes]:
    raw = base58.b58decode(private_key_b58)
    kp = Keypair.from_bytes(raw)
    return str(kp.pubkey()), raw


async def get_balance(address: str) -> float:
    payload = {"jsonrpc": "2.0", "id": 1, "method": "getBalance", "params": [address]}
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(RPC, json=payload)
        result = r.json().get("result", {})
        lamports = result.get("value", 0) if isinstance(result, dict) else result
        return lamports / 1_000_000_000
