# Windows 11 定时任务设置脚本
# 用于运行 C:\Users\bak\projects\zauto\1100WeekPushWx.js

# 设置变量
$TaskName = "WeekPushWxTask"
$ScriptPath = "C:\Users\bak\projects\zauto\1100WeekPushWx.js"
$NodePath = "node"
$WorkingDirectory = "C:\Users\bak\projects\zauto"

# 检查脚本文件是否存在
if (-not (Test-Path $ScriptPath)) {
    Write-Host "错误: 脚本文件不存在: $ScriptPath" -ForegroundColor Red
    Write-Host "请确认文件路径是否正确" -ForegroundColor Yellow
    exit 1
}

# 检查 Node.js 是否安装
try {
    $nodeVersion = & $NodePath --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Node.js 版本: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "错误: Node.js 未安装或不在 PATH 中" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "错误: 无法执行 Node.js" -ForegroundColor Red
    exit 1
}

# 删除已存在的任务（如果存在）
Write-Host "检查并删除已存在的任务..." -ForegroundColor Yellow
try {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Host "已删除旧任务" -ForegroundColor Green
} catch {
    Write-Host "没有找到旧任务，继续创建新任务" -ForegroundColor Yellow
}

# 创建任务触发器（每周一上午11:00执行）
$Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 11:00AM

# 创建任务动作
$Action = New-ScheduledTaskAction -Execute $NodePath -Argument $ScriptPath -WorkingDirectory $WorkingDirectory

# 创建任务设置
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# 创建任务主体（使用当前用户）
$Principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Highest

# 注册任务
try {
    Register-ScheduledTask -TaskName $TaskName -Trigger $Trigger -Action $Action -Settings $Settings -Principal $Principal -Description "每周推送微信消息任务"
    Write-Host "定时任务创建成功!" -ForegroundColor Green
    Write-Host "任务名称: $TaskName" -ForegroundColor Cyan
    Write-Host "执行时间: 每周一上午 11:00" -ForegroundColor Cyan
    Write-Host "脚本路径: $ScriptPath" -ForegroundColor Cyan
    Write-Host "工作目录: $WorkingDirectory" -ForegroundColor Cyan
} catch {
    Write-Host "创建任务失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 显示任务信息
Write-Host "`n任务详情:" -ForegroundColor Yellow
Get-ScheduledTask -TaskName $TaskName | Format-List

Write-Host "`n管理任务的方法:" -ForegroundColor Yellow
Write-Host "1. 打开任务计划程序: taskschd.msc" -ForegroundColor Cyan
Write-Host "2. 手动运行任务: Start-ScheduledTask -TaskName '$TaskName'" -ForegroundColor Cyan
Write-Host "3. 删除任务: Unregister-ScheduledTask -TaskName '$TaskName'" -ForegroundColor Cyan
Write-Host "4. 查看任务状态: Get-ScheduledTask -TaskName '$TaskName'" -ForegroundColor Cyan

# 测试脚本是否可以正常运行
Write-Host "`n正在测试脚本..." -ForegroundColor Yellow
try {
    Push-Location $WorkingDirectory
    $testResult = & $NodePath $ScriptPath 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "脚本测试成功!" -ForegroundColor Green
    } else {
        Write-Host "脚本测试失败，请检查脚本内容:" -ForegroundColor Red
        Write-Host $testResult -ForegroundColor Red
    }
    Pop-Location
} catch {
    Write-Host "脚本测试出错: $($_.Exception.Message)" -ForegroundColor Red
} 