#!/bin/bash

# APK Sign Script
# 对 APK 进行 zipalign 优化和签名

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 使用说明
usage() {
    echo "Usage: $0 <input.apk> <output.apk> [options]"
    echo ""
    echo "Options:"
    echo "  --debug                 Use debug keystore (auto-generated)"
    echo "  --keystore <path>       Path to keystore file"
    echo "  --keystore-pass <pass>  Keystore password"
    echo "  --key-alias <alias>     Key alias"
    echo "  --key-pass <pass>       Key password"
    echo ""
    echo "Examples:"
    echo "  $0 unsigned.apk signed.apk --debug"
    echo "  $0 unsigned.apk signed.apk --keystore my.keystore --keystore-pass pass123 --key-alias mykey --key-pass pass123"
    exit 1
}

# 检查参数
if [ $# -lt 2 ]; then
    usage
fi

INPUT_APK="$1"
OUTPUT_APK="$2"
shift 2

# 默认值
DEBUG_MODE=false
KEYSTORE_PATH=""
KEYSTORE_PASS=""
KEY_ALIAS=""
KEY_PASS=""

# 解析参数
while [ $# -gt 0 ]; do
    case "$1" in
        --debug)
            DEBUG_MODE=true
            shift
            ;;
        --keystore)
            KEYSTORE_PATH="$2"
            shift 2
            ;;
        --keystore-pass)
            KEYSTORE_PASS="$2"
            shift 2
            ;;
        --key-alias)
            KEY_ALIAS="$2"
            shift 2
            ;;
        --key-pass)
            KEY_PASS="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            usage
            ;;
    esac
done

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}APK Sign Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查输入文件
if [ ! -f "$INPUT_APK" ]; then
    echo -e "${RED}Error: Input APK not found: $INPUT_APK${NC}"
    exit 1
fi

echo -e "${YELLOW}Input APK: $INPUT_APK${NC}"
echo -e "${YELLOW}Output APK: $OUTPUT_APK${NC}"

# 获取脚本目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 检查必要工具
check_tool() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}Error: $1 is not installed or not in PATH${NC}"
        echo -e "${YELLOW}Please install Android SDK build-tools${NC}"
        exit 1
    fi
}

# 尝试查找 Android SDK 工具
find_android_tool() {
    local tool_name="$1"
    
    # 首先检查是否在 PATH 中
    if command -v "$tool_name" &> /dev/null; then
        echo "$tool_name"
        return 0
    fi
    
    # 检查 ANDROID_HOME
    if [ -n "$ANDROID_HOME" ]; then
        local build_tools_dir="$ANDROID_HOME/build-tools"
        if [ -d "$build_tools_dir" ]; then
            # 获取最新版本
            local latest_version=$(ls -1 "$build_tools_dir" | sort -V | tail -n 1)
            local tool_path="$build_tools_dir/$latest_version/$tool_name"
            if [ -f "$tool_path" ]; then
                echo "$tool_path"
                return 0
            fi
        fi
    fi
    
    # 检查常见路径
    local common_paths=(
        "/usr/local/lib/android/sdk/build-tools"
        "$HOME/Android/Sdk/build-tools"
        "$HOME/Library/Android/sdk/build-tools"
    )
    
    for base_path in "${common_paths[@]}"; do
        if [ -d "$base_path" ]; then
            local latest_version=$(ls -1 "$base_path" 2>/dev/null | sort -V | tail -n 1)
            if [ -n "$latest_version" ]; then
                local tool_path="$base_path/$latest_version/$tool_name"
                if [ -f "$tool_path" ]; then
                    echo "$tool_path"
                    return 0
                fi
            fi
        fi
    done
    
    echo ""
    return 1
}

# 查找工具
ZIPALIGN=$(find_android_tool "zipalign")
APKSIGNER=$(find_android_tool "apksigner")

if [ -z "$ZIPALIGN" ]; then
    echo -e "${RED}Error: zipalign not found${NC}"
    echo -e "${YELLOW}Please set ANDROID_HOME or add build-tools to PATH${NC}"
    exit 1
fi

if [ -z "$APKSIGNER" ]; then
    echo -e "${RED}Error: apksigner not found${NC}"
    echo -e "${YELLOW}Please set ANDROID_HOME or add build-tools to PATH${NC}"
    exit 1
fi

echo -e "${GREEN}Found zipalign: $ZIPALIGN${NC}"
echo -e "${GREEN}Found apksigner: $APKSIGNER${NC}"
echo ""

# 创建临时目录
TEMP_DIR=$(mktemp -d)
cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

ALIGNED_APK="$TEMP_DIR/aligned.apk"

# Debug 模式：生成 debug keystore
if [ "$DEBUG_MODE" = true ]; then
    echo -e "${YELLOW}Using debug signing mode${NC}"
    
    DEBUG_KEYSTORE="$TEMP_DIR/debug.keystore"
    KEYSTORE_PATH="$DEBUG_KEYSTORE"
    KEYSTORE_PASS="android"
    KEY_ALIAS="androiddebugkey"
    KEY_PASS="android"
    
    # 生成 debug keystore
    echo -e "${YELLOW}Generating debug keystore...${NC}"
    keytool -genkeypair \
        -alias "$KEY_ALIAS" \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -keystore "$DEBUG_KEYSTORE" \
        -storepass "$KEYSTORE_PASS" \
        -keypass "$KEY_PASS" \
        -dname "CN=Android Debug,O=Android,C=US" \
        2>/dev/null
    
    echo -e "${GREEN}Debug keystore generated${NC}"
fi

# 验证 keystore 配置
if [ -z "$KEYSTORE_PATH" ] || [ -z "$KEYSTORE_PASS" ] || [ -z "$KEY_ALIAS" ] || [ -z "$KEY_PASS" ]; then
    echo -e "${RED}Error: Missing keystore configuration${NC}"
    echo -e "${YELLOW}Use --debug for debug signing or provide all keystore parameters${NC}"
    usage
fi

if [ ! -f "$KEYSTORE_PATH" ]; then
    echo -e "${RED}Error: Keystore file not found: $KEYSTORE_PATH${NC}"
    exit 1
fi

# Step 1: zipalign
echo ""
echo -e "${YELLOW}Step 1: Running zipalign...${NC}"
"$ZIPALIGN" -v -p 4 "$INPUT_APK" "$ALIGNED_APK"

if [ ! -f "$ALIGNED_APK" ]; then
    echo -e "${RED}Error: zipalign failed${NC}"
    exit 1
fi
echo -e "${GREEN}zipalign completed${NC}"

# Step 2: Sign APK
echo ""
echo -e "${YELLOW}Step 2: Signing APK...${NC}"
"$APKSIGNER" sign \
    --ks "$KEYSTORE_PATH" \
    --ks-pass "pass:$KEYSTORE_PASS" \
    --ks-key-alias "$KEY_ALIAS" \
    --key-pass "pass:$KEY_PASS" \
    --out "$OUTPUT_APK" \
    "$ALIGNED_APK"

if [ ! -f "$OUTPUT_APK" ]; then
    echo -e "${RED}Error: Signing failed${NC}"
    exit 1
fi
echo -e "${GREEN}Signing completed${NC}"

# Step 3: Verify signature
echo ""
echo -e "${YELLOW}Step 3: Verifying signature...${NC}"
"$APKSIGNER" verify --verbose "$OUTPUT_APK"

# 输出结果
APK_SIZE=$(du -h "$OUTPUT_APK" | cut -f1)
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}APK signed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Output: $OUTPUT_APK${NC}"
echo -e "${GREEN}Size: $APK_SIZE${NC}"
