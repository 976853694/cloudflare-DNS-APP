# APK Repack Workflow

自动化 APK 重新打包工作流，使用 GitHub Actions 将解压后的 APK 资源重新打包成可安装的 APK 文件。

## 功能特性

- ✅ 自动收集所有 APK 组件并打包
- ✅ 支持 Debug 和 Release 签名
- ✅ GitHub Actions 自动化构建
- ✅ 手动触发构建
- ✅ 自动发布到 GitHub Releases

## 快速开始

### 1. Debug 构建（无需配置）

推送代码到 `main` 分支，或手动触发工作流选择 `debug` 模式。

### 2. Release 构建

手动触发工作流选择 `release` 模式，或推送 `v*` 标签。

Release 构建会自动生成签名密钥，无需配置任何 Secrets。

## 手动触发构建

1. 进入 GitHub 仓库 → Actions → Build APK
2. 点击 "Run workflow"
3. 选择 Build type (debug/release)
4. 点击 "Run workflow"

## 本地构建

### 构建未签名 APK

```bash
chmod +x scripts/build-apk.sh
./scripts/build-apk.sh unsigned.apk
```

### Debug 签名

```bash
chmod +x scripts/sign-apk.sh
./scripts/sign-apk.sh unsigned.apk signed.apk --debug
```

### Release 签名

```bash
./scripts/sign-apk.sh unsigned.apk signed.apk \
  --keystore your.keystore \
  --keystore-pass your_password \
  --key-alias your_alias \
  --key-pass your_key_password
```

## 项目结构

```
├── .github/workflows/
│   └── build-apk.yml      # GitHub Actions 工作流
├── scripts/
│   ├── build-apk.sh       # APK 构建脚本
│   └── sign-apk.sh        # APK 签名脚本
├── AndroidManifest.xml    # 应用清单
├── classes.dex            # DEX 文件
├── resources.arsc         # 资源文件
├── assets/                # 资源目录
├── lib/                   # 原生库
└── res/                   # 编译后资源
```

## 下载构建产物

1. 进入 GitHub 仓库 → Actions
2. 选择成功的工作流运行
3. 在 Artifacts 部分下载 APK

## License

MIT
