/**
 * Đảm bảo dependencies của client/ đã được cài trước khi build/dev giao diện.
 * Sửa lỗi "sh: line 1: vite: command not found" khi clone mới mà chưa chạy
 * `npm run install:client`. Được gọi tự động bởi các hook prebuild / predev:client.
 */
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const marker = path.join(root, 'client', 'node_modules', 'vite');

if (!fs.existsSync(marker)) {
  console.log('[deps] client/ chưa có node_modules — đang cài dependencies giao diện…');
  execSync('npm --prefix client install', { stdio: 'inherit', cwd: root });
  console.log('[deps] đã cài xong dependencies của client/.');
}
