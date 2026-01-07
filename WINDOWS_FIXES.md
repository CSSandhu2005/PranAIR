# Windows EPERM Fix Instructions for PranAIR

## Problem
Windows Desktop folder + OneDrive sync + Turbopack causes EPERM file rename errors:
```
Error: EPERM: operation not permitted, rename
```

## Root Causes
1. **OneDrive/Desktop Sync**: Desktop folder syncs to OneDrive, locking files
2. **Windows Defender**: Real-time scanning locks .next folder files
3. **NTFS Race Condition**: Turbopack's rapid file writes conflict with Windows file system

## ✅ Applied Fixes (Automatic)
- [x] Fixed workspace root detection in next.config.ts
- [x] Removed deprecated middleware.ts
- [x] Added error.tsx and not-found.tsx
- [x] Cleaned corrupted .next artifacts

## ⚠️ Manual Fixes Required (Run as Administrator)

### Fix 1: Add Windows Defender Exclusion
**Run PowerShell as Administrator:**
```powershell
Add-MpPreference -ExclusionPath "C:\Users\Aayush Solanke\Desktop\Extra Folders\Coding\Projects\PranAIR\.next"
Add-MpPreference -ExclusionPath "C:\Users\Aayush Solanke\Desktop\Extra Folders\Coding\Projects\PranAIR\node_modules"
```

### Fix 2: Disable OneDrive Sync for Project Folder
**Option A - Exclude from OneDrive:**
1. Right-click project folder: `PranAIR`
2. Properties → Advanced
3. Uncheck "Always available on this device"
4. OK

**Option B - Move project out of Desktop:**
```powershell
# Run as Administrator
mkdir C:\dev
Move-Item "C:\Users\Aayush Solanke\Desktop\Extra Folders\Coding\Projects\PranAIR" "C:\dev\pranair"
cd C:\dev\pranair
npm run dev
```

### Fix 3: Disable Real-Time Scanning Temporarily
```powershell
# Run as Administrator (lasts until restart)
Set-MpPreference -DisableRealtimeMonitoring $true
```

## 🔄 Alternative: Use WSL2 (Recommended)
Windows Subsystem for Linux avoids all Windows file system issues:
```bash
wsl --install
# Then clone project in WSL and develop there
```

## 📝 Current Status
- Workspace root: Fixed ✅
- Middleware: Removed ✅  
- Error pages: Added ✅
- EPERM: Needs admin fix ⚠️

## Next Steps
1. Run one of the admin fixes above
2. Clean and restart: `npm run dev`
3. If still failing, move project to C:\dev or use WSL2
