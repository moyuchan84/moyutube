# Windows 내장 TTS(Microsoft Heami)로 대사별 가이드 음성 WAV를 만든다.
# 사용: powershell -File scripts/tts.ps1 ep01
param([string]$Episode = "ep01")

Add-Type -AssemblyName System.Speech
$root = Split-Path -Parent $PSScriptRoot
# 편 폴더: qna/content/<편 코드>-<slug>/
$unit = Get-ChildItem (Join-Path $root "..\content") -Directory | Where-Object { $_.Name -like "$Episode-*" -or $_.Name -eq $Episode } | Select-Object -First 1
if (-not $unit) { throw "편 폴더가 없다: content/$Episode-*" }
$script = Get-Content -Raw -Encoding UTF8 (Join-Path $unit.FullName "script\script.json") | ConvertFrom-Json
$voiceDir = Join-Path $unit.FullName "voice"
New-Item -ItemType Directory -Force $voiceDir | Out-Null

# 화자별 말투: 아이는 높고 빠르게, 다큐 톤은 낮고 느리게
# rate는 배수로 쓴다 ("0%" 같은 퍼센트 표기는 Heami에서 속도가 3배 느려지는 버그가 있음)
$prosody = @{
  narr = @{ pitch = "default"; rate = "1.05" }
  dad  = @{ pitch = "low";     rate = "1.0" }
  kid  = @{ pitch = "x-high";  rate = "1.15" }
  docu = @{ pitch = "x-low";   rate = "0.75" }
  granny = @{ pitch = "high";  rate = "1.1" }
}

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice("Microsoft Heami Desktop")
$format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo 44100, ([System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen), ([System.Speech.AudioFormat.AudioChannel]::Mono)

$timing = [ordered]@{}
foreach ($cut in $script.cuts) {
  $i = 0
  foreach ($line in $cut.lines) {
    $id = "$($cut.id)-$i"
    $text = if ($line.tts) { $line.tts } else { $line.text }
    $text = [System.Security.SecurityElement]::Escape($text)
    $p = $prosody[$line.who]
    if (-not $p) { $p = $prosody["narr"] }
    $ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='ko-KR'><prosody pitch='$($p.pitch)' rate='$($p.rate)'>$text</prosody></speak>"
    $out = Join-Path $voiceDir "$id.wav"
    $synth.SetOutputToWaveFile($out, $format)
    $synth.SpeakSsml($ssml)
    $synth.SetOutputToNull()
    $bytes = (Get-Item $out).Length - 44
    $timing[$id] = [math]::Round($bytes / (44100 * 2), 3)
    $i++
  }
}
$synth.Dispose()

# BOM 없이 저장 (Out-File utf8은 BOM을 붙여서 JSON import가 깨질 수 있음)
[System.IO.File]::WriteAllText((Join-Path $unit.FullName "script\timing.json"), ($timing | ConvertTo-Json))
"voice lines: $($timing.Count)"
