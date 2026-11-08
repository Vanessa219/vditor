# AGENTS.md

Vditor 仓库工作指南。仓库：`Vanessa219/vditor`；许可证：MIT。

## 1. 开始任务与 Git

- 每次仓库任务开始时，核对路径、远程仓库、分支、提交和工作区。最新分支任务先获取相关远程引用；指定历史提交、标签或 Release 的任务只获取解析该版本所需的引用，不推进该版本。
- 开发基线优先使用 `dev`；不存在时使用核实后的默认分支。当前 GitHub 默认分支为 `master`，它与 `dev` 的用途不同，不套用其他仓库的分支禁令。
- 干净且仅落后远程的开发分支可以快进。保留已有改动，不自动丢弃或重置改动，不自动使用 `git stash` 或创建合并提交；分支分叉时先检查原因。
- 修改前简要说明结论、证据和必要的不确定性。选择最小充分实现，保留现有公共接口、Markdown 往返语义和已有用户配置。
- 未获用户明确授权，不提交、推送、创建发布标签、发布 Release 或触发会发布 npm 的工作流。修改代码、提升版本号和维护工作流本身不代表发布授权；已有授权在同一约定范围内持续有效。
- 每次提交前复核分支和暂存差异，推送前核对远程地址及目标分支。遵循近期英文 gitmoji 提交风格；只有确有相关 issue/PR 时才附其完整 URL。
- 向 `master` 同步工作流等指定改动时，限定为获授权的文件或提交；不要顺带合并整个开发分支，不改写已发布标签。

## 2. 工具链与依赖

- 发布工具链以 [.github/workflows/publish.yml](.github/workflows/publish.yml) 为准：Node.js 24、pnpm 12.6.0。调整工具链时同步核对工作流、锁文件及 `pnpm-workspace.yaml`。
- 使用 `pnpm install --frozen-lockfile` 验证依赖可安装。仓库的 `pnpm-workspace.yaml` 使用 `allowBuilds`，不要仅根据 `lockfileVersion: 9.0` 选择 pnpm 9。
- 保留 `allowBuilds` 的安装脚本限制；不要为使 CI 通过而放开所有依赖脚本、删除工作区配置或重写锁文件。
- `allowBuilds.puppeteer: false` 会禁止 Puppeteer 安装脚本。浏览器测试另需可用的兼容 Chrome；检查 `__test__/util/launchBrowser.ts`，不要把浏览器缺失误报为产品回归。

## 3. 源码与兼容性

- `src/index.ts`、`src/method.ts` 为入口；`src/ts/` 为编辑器逻辑；`types/` 为公开类型；`src/assets/less/` 为样式；`src/js/i18n/` 为语言资源；`__test__/` 为 Jest 测试。
- 改动编辑行为时检查 SV、IR、WYSIWYG 三种模式，以及桌面、移动端、复制粘贴、输入法和撤销重做中受影响的路径。
- 公共选项、方法、默认值、快捷键或返回值改变时，按影响同步 `types/`、`README.md`、`README_en_US.md`、`CHANGELOG.md` 和对应测试；内部调整不扩写无关文档。
- TypeScript/JavaScript 新增代码使用双引号、分号和空格缩进，遵循所在文件的结构。注释用中文，解释当前行为或原因，不重复代码本身。
- `dist/`、`demo/dist/` 是生成目录。修改源码后由构建生成，不直接修补产物。第三方运行时保留其许可证，不套用 SiYuan 的源码头规则。
- 常规验证优先使用类型检查和隔离测试，不覆盖开发者正在使用的构建产物，也不重启其开发服务；发布构建由 Actions 执行。

## 4. Lute 更新

- [88250/lute](https://github.com/88250/lute) 是 `src/js/lute/lute.min.js` 的上游，不手工编辑该压缩文件。
- 先核对 Lute 仓库身份、分支、提交和已有改动。其本地路径通常为 `go env GOPATH` 下的 `src/github.com/88250/lute`，不要假定它是本仓库的相邻目录。
- 按 Lute 的 `javascript/README.md` 使用匹配的 Go/GopherJS 工具链重新生成 JavaScript，再复制到本仓库。记录源码提交，核对产物内容和哈希；不要用旧构建结果冒充新产物。
- 核对 Vditor 使用的转换接口和 Markdown 往返行为，运行 Lute 上游测试及本仓库受影响的解析、转换和编辑测试，尤其关注引用定义、数学公式、列表、表格和 callout。
- 构建时 `webpack.config.js` 将 `src/js` 复制到 `dist/js`，npm 包包含 `dist/`；运行时单独加载 Lute，默认地址由 Vditor 版本和 CDN 配置生成。
- 用户要求同步到 SiYuan 时，另外核对该仓库及其规则、Go 依赖和 JavaScript。已包含同一修复时不重复升级；比较产物时区分内容变化与换行差异，不顺带修改 npm 依赖或生成目录。

## 5. 验证与测试

- 按改动风险选择测试，先阅读测试依赖。不要把类型检查、lint 或构建成功当作行为测试通过。
- 类型检查：`pnpm exec tsc --noEmit`。
- 定向 Jest：`pnpm exec jest --runInBand --runTestsByPath <test-file> [...]`。`pnpm test` 运行带覆盖率的 Jest 测试；文件名中的 `.browser` 并不能覆盖所有浏览器测试，`.spec.ts` 也可能依赖浏览器。
- 当前 `pnpm run lint` 只执行 `eslint eslint.config.mjs`，不检查整个 `src/`。修改 TypeScript 时另用 `pnpm exec eslint <changed-source-files>`；注意现有配置忽略 `.js` 文件，不为获得通过结果而扩大忽略范围。
- 依赖 `http://localhost:9000/jest-puppeteer.html` 的测试需要由 `webpack.start.js` 提供的演示服务。先检查端口和现有服务；可使用 `pnpm start` 启动所需服务，等待页面及本地资源就绪后再执行测试，并只停止自己启动的进程。
- 独立启动测试服务器的用例和纯解析测试可按自身前置条件运行。不要不加区分地执行整套测试后将缺少演示服务造成的失败归因于源码。
- 测试与源代码在同一改动中维护，保留相邻覆盖。汇报实际运行的命令、通过或失败的范围，以及未验证的浏览器交互；不从 CI 或发布成功推断测试通过。
- 纯文档改动检查事实、内部路径、语言和差异，不运行自动修复 lint 或无关代码测试。

## 6. 版本与发布

- 版本来源为 `package.json`，构建时通过 `webpack.config.js` 注入。升级前搜索仓库中的版本引用并检查锁文件格式，不凭空增加版本字段或手改生成产物。
- 预发布版本按既有序列递增；发布前查询 npm 已有版本和 dist-tags，确认目标版本未被占用。不能仅依据当前 `alpha` 标签判断某个历史版本不存在。
- 发布工作流订阅 `release.published`，支持从草稿发布。GitHub Pre-release 对应带预发布后缀的包版本并发布到 `alpha`；正式 Release 对应正式包版本并发布到 `latest`。
- Release 标签须为包版本或其 `v` 前缀形式，Release 的预发布标记须与版本后缀一致。选择的标签提交必须包含待发布源码、版本号及适用的工作流。
- `workflow_dispatch` 入口需要工作流存在于默认分支。工作流改动按授权同步到默认分支及开发分支；不要假定重新运行历史标签会读取最新工作流。
- npm 使用 GitHub Actions Trusted Publisher/OIDC：保持 `id-token: write`、匹配的仓库和工作流文件名，以及 npm 端的直接发布权限；不添加长期 `NPM_TOKEN`，不扩大 npm 权限来绕过配置错误。
- 发布前完成适用检查。工作流负责安装、构建、检查包内容和发布，但当前不运行 Jest；发布成功不代表整套测试通过。
- 发布后分别验证 Release 字段和标签提交、Actions 实际执行的步骤、npm 版本和 dist-tags，以及必要的包内容。npm 返回“正在处理”或公开查询仍为 404 时，明确报告可用性尚待确认，不重复发布同一版本。
- 取消、重跑或创建发布请求后读取远程状态；接口报错与查询矛盾时说明实际结果，不声称取消成功，不盲目重复创建 Release 或发布任务。

## 7. Windows 与外部写入

- 先确认 shell；简单命令使用明确的工作目录，不拼接跨 shell 的文件操作。非 ASCII 编辑内容通过 UTF-8 文件和文件编辑工具传递，不放入 shell 管道、`node -e` 或 `python -c`。
- GitHub 操作优先使用 `gh`。包含非 ASCII 文本的写入使用独立的 UTF-8 JSON 临时文件和 `gh api --input`，写后读取并逐字段核对，确认远程结果后再重试失败请求。
- 临时文件放在系统临时目录。递归清理前核实绝对路径和目标范围；保留遇到策略拒绝或无法确认归属的目录，不删除用户工作或绕过拒绝。
