#!/bin/bash

# APK Build Script
# 将解压后的 APK 资源重新打包成未签名的 APK 文件

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 默认输出文件名
OUTPUT_APK="${1:-unsigned.apk}"

# 获取脚本所在目录的父目录作为项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}APK Build Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 切换到项目根目录
cd "$PROJECT_ROOT"
echo -e "${YELLOW}Working directory: $(pwd)${NC}"

# 必需文件列表
REQUIRED_FILES=(
    "AndroidManifest.xml"
    "classes.dex"
    "resources.arsc"
)

# 检查必需文件
echo ""
echo -e "${YELLOW}Checking required files...${NC}"
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
        echo -e "${RED}✗ Missing: $file${NC}"
    else
        echo -e "${GREEN}✓ Found: $file${NC}"
    fi
done

# 如果有缺失文件，退出
if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}Error: Missing required files:${NC}"
    for file in "${MISSING_FILES[@]}"; do
        echo -e "${RED}  - $file${NC}"
    done
    exit 1
fi

# 检查可选目录
echo ""
echo -e "${YELLOW}Checking optional directories...${NC}"

OPTIONAL_DIRS=("assets" "lib" "res" "kotlin" "META-INF")
for dir in "${OPTIONAL_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓ Found directory: $dir${NC}"
    else
        echo -e "${YELLOW}○ Optional directory not found: $dir${NC}"
    fi
done

# 创建临时目录
TEMP_DIR=$(mktemp -d)
echo ""
echo -e "${YELLOW}Creating temporary directory: $TEMP_DIR${NC}"

# 清理函数
cleanup() {
    if [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi
}
trap cleanup EXIT

# 复制所有文件到临时目录
echo ""
echo -e "${YELLOW}Copying files to temporary directory...${NC}"

# 复制必需文件
cp AndroidManifest.xml "$TEMP_DIR/"
cp resources.arsc "$TEMP_DIR/"

# 复制所有 DEX 文件
for dex in classes*.dex; do
    if [ -f "$dex" ]; then
        cp "$dex" "$TEMP_DIR/"
        echo -e "${GREEN}  Copied: $dex${NC}"
    fi
done

# 复制可选目录
for dir in "${OPTIONAL_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        cp -r "$dir" "$TEMP_DIR/"
        echo -e "${GREEN}  Copied directory: $dir${NC}"
    fi
done

# 复制其他可能需要的文件
OTHER_FILES=("DebugProbesKt.bin" "kotlin-tooling-metadata.json" "androidsupportmultidexversion.txt")
for file in "${OTHER_FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$TEMP_DIR/"
        echo -e "${GREEN}  Copied: $file${NC}"
    fi
done

# 复制其他目录 (dc, io, okhttp3 等)
for dir in dc io okhttp3; do
    if [ -d "$dir" ]; then
        cp -r "$dir" "$TEMP_DIR/"
        echo -e "${GREEN}  Copied directory: $dir${NC}"
    fi
done

# 删除旧的签名信息 (如果存在)
if [ -d "$TEMP_DIR/META-INF" ]; then
    rm -f "$TEMP_DIR/META-INF/"*.SF
    rm -f "$TEMP_DIR/META-INF/"*.RSA
    rm -f "$TEMP_DIR/META-INF/"*.DSA
    echo -e "${YELLOW}  Removed old signature files from META-INF${NC}"
fi

# 创建 APK
echo ""
echo -e "${YELLOW}Creating APK file...${NC}"

cd "$TEMP_DIR"

# 使用 zip 创建 APK，注意压缩级别
# -r: 递归
# -9: 最大压缩
# -X: 不包含额外的文件属性
zip -r -9 -X "$PROJECT_ROOT/$OUTPUT_APK" . -x "*.DS_Store" -x "__MACOSX/*"

cd "$PROJECT_ROOT"

# 验证 APK 创建成功
if [ -f "$OUTPUT_APK" ]; then
    APK_SIZE=$(du -h "$OUTPUT_APK" | cut -f1)
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}APK created successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Output: $OUTPUT_APK${NC}"
    echo -e "${GREEN}Size: $APK_SIZE${NC}"
else
    echo -e "${RED}Error: Failed to create APK${NC}"
    exit 1
fi
