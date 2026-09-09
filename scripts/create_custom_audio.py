import math
import wave
from pathlib import Path

out = Path(__file__).resolve().parents[1] / "test-fixtures" / "custom-security-call.wav"
out.parent.mkdir(parents=True, exist_ok=True)
rate = 16000
duration = 4
with wave.open(str(out), "wb") as audio:
    audio.setnchannels(1)
    audio.setsampwidth(2)
    audio.setframerate(rate)
    for i in range(rate * duration):
        t = i / rate
        carrier = math.sin(2 * math.pi * (180 + 25 * math.sin(2 * math.pi * 1.8 * t)) * t)
        harmonic = 0.22 * math.sin(2 * math.pi * 360 * t)
        envelope = min(1, t * 8, (duration - t) * 8)
        sample = int(max(-1, min(1, (carrier + harmonic) * 0.35 * envelope)) * 32767)
        audio.writeframesraw(sample.to_bytes(2, "little", signed=True))
print(out)
