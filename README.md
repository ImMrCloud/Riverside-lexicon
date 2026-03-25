# 由于已有较好现成客户端 故**停止维护**

## Riverside Lexicon

Riverside Lexicon is a customized mobile application based on the open-source project Lexicon (https://github.com/lexiconhq/lexicon).

Riverside Lexicon 是一个基于开源项目 Lexicon 二次开发的移动端应用，针对 **清水河畔** 需求进行了定制与扩展。

------

## About / 关于项目

Lexicon is a customizable, open source mobile App Template built on top of Discourse (https://www.discourse.org).

Lexicon 是一个基于 Discourse 平台构建的开源移动端应用模板。

This repository contains modifications and extensions tailored for **Riverside community** usage.

本仓库包含在 Lexicon 基础上为 **清水河畔** 社区定制开发的功能与改进。

------

## Features / 功能特点

- Mobile client based on Discourse API
- Customized UI and user experience
- React Native + TypeScript
- Yarn for dependency management
- 基于 Discourse API 的移动端客户端
- 定制化 UI 与用户体验
- 使用 React Native + TypeScript
- 使用 Yarn 进行依赖管理

------

## Installation / 安装与运行

Clone the repository:

克隆仓库：

git clone https://github.com/ImMrCloud/Riverside-lexicon.git
 cd Riverside-lexicon

Install dependencies and generate GraphQL schema:

安装依赖并生成 GraphQL schema：

yarn && yarn generate

------

Quick Start / 快速开始

Run the backend API and frontend app:

启动后端 API 与前端应用：

Start API server:
 yarn --cwd api start

Start frontend app:
 cd frontend
 yarn start

Scan the QR code with Expo Go on your mobile device to open the app.

使用 Expo Go 扫描二维码即可在手机上运行应用。

------

## Configuration / 配置说明

You can configure the Discourse server URL in:

你可以在以下文件中配置 Discourse 服务器地址：

frontend/Config.ts

Example:

localDevelopment:
 proseUrl: http://localhost

------

## Acknowledgements / 致谢

This project is derived from the open-source project:

本项目基于以下开源项目二次开发：

Lexicon
 https://github.com/lexiconhq/lexicon
 License: MIT License

Original authors: LexiconHQ
 原始作者：LexiconHQ

------

## License / 开源协议

This project is licensed under the MIT License.

本项目遵循 MIT 开源协议。

Original work Copyright (c) LexiconHQ
 Modifications Copyright (c) 2026 ImMrCloud

See the LICENSE file for details.
 详细信息请参阅 LICENSE 文件。

------

## Documentation / 文档

Original Lexicon documentation:
 Lexicon 官方文档：
 https://docs.lexicon.is

------

## Contributing / 贡献

Pull requests and issues are welcome.

欢迎提交 Issue 与 Pull Request。
