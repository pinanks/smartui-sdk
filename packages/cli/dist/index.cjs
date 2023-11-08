#!/usr/bin/env node
'use strict';

var commander = require('commander');
var which = require('which');
var listr2 = require('listr2');
var chalk3 = require('chalk');
var fastify = require('fastify');
var fs = require('fs');
var path = require('path');
var axios = require('axios');
var child_process = require('child_process');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var which__default = /*#__PURE__*/_interopDefault(which);
var chalk3__default = /*#__PURE__*/_interopDefault(chalk3);
var fastify__default = /*#__PURE__*/_interopDefault(fastify);
var fs__default = /*#__PURE__*/_interopDefault(fs);
var path__default = /*#__PURE__*/_interopDefault(path);
var axios__default = /*#__PURE__*/_interopDefault(axios);

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// ../../node_modules/.pnpm/path-key@3.1.1/node_modules/path-key/index.js
var require_path_key = __commonJS({
  "../../node_modules/.pnpm/path-key@3.1.1/node_modules/path-key/index.js"(exports, module) {
    var pathKey = (options = {}) => {
      const environment = options.env || process.env;
      const platform = options.platform || process.platform;
      if (platform !== "win32") {
        return "PATH";
      }
      return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
    };
    module.exports = pathKey;
    module.exports.default = pathKey;
  }
});

// ../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = __commonJS({
  "../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/resolveCommand.js"(exports, module) {
    var path2 = __require("path");
    var which2 = __require("which");
    var getPathKey = require_path_key();
    function resolveCommandAttempt(parsed, withoutPathExt) {
      const env2 = parsed.options.env || process.env;
      const cwd = process.cwd();
      const hasCustomCwd = parsed.options.cwd != null;
      const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
      if (shouldSwitchCwd) {
        try {
          process.chdir(parsed.options.cwd);
        } catch (err) {
        }
      }
      let resolved;
      try {
        resolved = which2.sync(parsed.command, {
          path: env2[getPathKey({ env: env2 })],
          pathExt: withoutPathExt ? path2.delimiter : void 0
        });
      } catch (e) {
      } finally {
        if (shouldSwitchCwd) {
          process.chdir(cwd);
        }
      }
      if (resolved) {
        resolved = path2.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
      }
      return resolved;
    }
    function resolveCommand(parsed) {
      return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
    }
    module.exports = resolveCommand;
  }
});

// ../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/escape.js
var require_escape = __commonJS({
  "../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/escape.js"(exports, module) {
    var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
    function escapeCommand(arg) {
      arg = arg.replace(metaCharsRegExp, "^$1");
      return arg;
    }
    function escapeArgument(arg, doubleEscapeMetaChars) {
      arg = `${arg}`;
      arg = arg.replace(/(\\*)"/g, '$1$1\\"');
      arg = arg.replace(/(\\*)$/, "$1$1");
      arg = `"${arg}"`;
      arg = arg.replace(metaCharsRegExp, "^$1");
      if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, "^$1");
      }
      return arg;
    }
    module.exports.command = escapeCommand;
    module.exports.argument = escapeArgument;
  }
});

// ../../node_modules/.pnpm/shebang-regex@3.0.0/node_modules/shebang-regex/index.js
var require_shebang_regex = __commonJS({
  "../../node_modules/.pnpm/shebang-regex@3.0.0/node_modules/shebang-regex/index.js"(exports, module) {
    module.exports = /^#!(.*)/;
  }
});

// ../../node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js
var require_shebang_command = __commonJS({
  "../../node_modules/.pnpm/shebang-command@2.0.0/node_modules/shebang-command/index.js"(exports, module) {
    var shebangRegex = require_shebang_regex();
    module.exports = (string = "") => {
      const match = string.match(shebangRegex);
      if (!match) {
        return null;
      }
      const [path2, argument] = match[0].replace(/#! ?/, "").split(" ");
      const binary = path2.split("/").pop();
      if (binary === "env") {
        return argument;
      }
      return argument ? `${binary} ${argument}` : binary;
    };
  }
});

// ../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = __commonJS({
  "../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/util/readShebang.js"(exports, module) {
    var fs4 = __require("fs");
    var shebangCommand = require_shebang_command();
    function readShebang(command3) {
      const size = 150;
      const buffer = Buffer.alloc(size);
      let fd;
      try {
        fd = fs4.openSync(command3, "r");
        fs4.readSync(fd, buffer, 0, size, 0);
        fs4.closeSync(fd);
      } catch (e) {
      }
      return shebangCommand(buffer.toString());
    }
    module.exports = readShebang;
  }
});

// ../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/parse.js
var require_parse = __commonJS({
  "../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/parse.js"(exports, module) {
    var path2 = __require("path");
    var resolveCommand = require_resolveCommand();
    var escape = require_escape();
    var readShebang = require_readShebang();
    var isWin = process.platform === "win32";
    var isExecutableRegExp = /\.(?:com|exe)$/i;
    var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
    function detectShebang(parsed) {
      parsed.file = resolveCommand(parsed);
      const shebang = parsed.file && readShebang(parsed.file);
      if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        return resolveCommand(parsed);
      }
      return parsed.file;
    }
    function parseNonShell(parsed) {
      if (!isWin) {
        return parsed;
      }
      const commandFile = detectShebang(parsed);
      const needsShell = !isExecutableRegExp.test(commandFile);
      if (parsed.options.forceShell || needsShell) {
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
        parsed.command = path2.normalize(parsed.command);
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
        const shellCommand = [parsed.command].concat(parsed.args).join(" ");
        parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
        parsed.command = process.env.comspec || "cmd.exe";
        parsed.options.windowsVerbatimArguments = true;
      }
      return parsed;
    }
    function parse(command3, args, options) {
      if (args && !Array.isArray(args)) {
        options = args;
        args = null;
      }
      args = args ? args.slice(0) : [];
      options = Object.assign({}, options);
      const parsed = {
        command: command3,
        args,
        options,
        file: void 0,
        original: {
          command: command3,
          args
        }
      };
      return options.shell ? parsed : parseNonShell(parsed);
    }
    module.exports = parse;
  }
});

// ../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/enoent.js
var require_enoent = __commonJS({
  "../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/lib/enoent.js"(exports, module) {
    var isWin = process.platform === "win32";
    function notFoundError(original, syscall) {
      return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: "ENOENT",
        errno: "ENOENT",
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args
      });
    }
    function hookChildProcess(cp, parsed) {
      if (!isWin) {
        return;
      }
      const originalEmit = cp.emit;
      cp.emit = function(name, arg1) {
        if (name === "exit") {
          const err = verifyENOENT(arg1, parsed);
          if (err) {
            return originalEmit.call(cp, "error", err);
          }
        }
        return originalEmit.apply(cp, arguments);
      };
    }
    function verifyENOENT(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawn");
      }
      return null;
    }
    function verifyENOENTSync(status, parsed) {
      if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, "spawnSync");
      }
      return null;
    }
    module.exports = {
      hookChildProcess,
      verifyENOENT,
      verifyENOENTSync,
      notFoundError
    };
  }
});

// ../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/index.js
var require_cross_spawn = __commonJS({
  "../../node_modules/.pnpm/cross-spawn@7.0.3/node_modules/cross-spawn/index.js"(exports, module) {
    var cp = __require("child_process");
    var parse = require_parse();
    var enoent = require_enoent();
    function spawn2(command3, args, options) {
      const parsed = parse(command3, args, options);
      const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
      enoent.hookChildProcess(spawned, parsed);
      return spawned;
    }
    function spawnSync(command3, args, options) {
      const parsed = parse(command3, args, options);
      const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
      result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
      return result;
    }
    module.exports = spawn2;
    module.exports.spawn = spawn2;
    module.exports.sync = spawnSync;
    module.exports._parse = parse;
    module.exports._enoent = enoent;
  }
});
var server_default = (ctx) => __async(void 0, null, function* () {
  const server = fastify__default.default({ logger: false });
  const opts = {};
  const SMARTUI_DOM = fs.readFileSync(__require.resolve("@lambdatest/serialize-dom"), "utf-8");
  server.get("/dom", opts, (request, reply) => {
    reply.code(200).send({ data: { dom: SMARTUI_DOM } });
  });
  server.post("/snapshot", opts, (request, reply) => __async(void 0, null, function* () {
    request.body.dom = Buffer.from(request.body.dom).toString("base64");
    try {
      yield ctx.client.uploadSnapshot(ctx.build.id, request.body);
    } catch (error) {
      reply.code(500).send({ error: { message: "it does not work" } });
    }
    reply.code(200).send({ data: { status: "it works" } });
  }));
  try {
    yield server.listen({ port: 8080 });
  } catch (error) {
    throw new Error(error.message);
  }
  return server;
});

// src/tasks/startServer.ts
var startServer_default = (ctx) => {
  return {
    title: `Setting up SmartUI server`,
    task: (ctx2, task) => __async(void 0, null, function* () {
      try {
        ctx2.server = yield server_default(ctx2);
        task.output = chalk3__default.default.gray(`listening on port ${ctx2.server.addresses()[0].port}`);
        task.title = "SmartUI started";
      } catch (error) {
        console.error(error);
        throw new Error("SmartUI server setup failed");
      }
    }),
    rendererOptions: { persistentOutput: true }
  };
};
var auth_default = (ctx) => {
  return {
    title: `Authenticating with SmartUI`,
    task: (ctx2, task) => __async(void 0, null, function* () {
      try {
        yield ctx2.client.auth();
        task.output = chalk3__default.default.gray(`using project token '******#${ctx2.env.PROJECT_TOKEN.split("#").pop()}'`);
        task.title = "Authenticated with SmartUI";
      } catch (error) {
        throw new Error("Authentication failed");
      }
    }),
    rendererOptions: { persistentOutput: true }
  };
};
var DEFAULT_WEB_STATIC_CONFIG = [
  {
    "name": "lambdatest-home-page",
    "url": "https://www.lambdatest.com",
    "waitForTimeout": 1e3
  },
  {
    "name": "example-page",
    "url": "https://example.com/"
  }
];
var DEFAULT_WEB_CONFIG = {
  web: {
    browsers: [
      "chrome",
      "firefox",
      "safari",
      "edge"
    ],
    resolutions: [
      [1920, 1080],
      [1366, 768],
      [360, 640]
    ]
  }
};
function createWebConfig(filepath) {
  filepath = filepath || "smartui-web.json";
  let filetype = path__default.default.extname(filepath);
  if (filetype != ".json") {
    console.log("Error: Config file must have .json extension");
    return;
  }
  if (fs__default.default.existsSync(filepath)) {
    console.log(`Error: SmartUI Web Config already exists: ${filepath}`);
    console.log(`To create a new file, please specify the file name like: 'smartui config:create-web webConfig.json'`);
    return;
  }
  fs__default.default.mkdirSync(path__default.default.dirname(filepath), { recursive: true });
  fs__default.default.writeFileSync(filepath, JSON.stringify(DEFAULT_WEB_CONFIG, null, 2) + "\n");
  console.log(`Created SmartUI Web Config: ${filepath}`);
}
function createWebStaticConfig(filepath) {
  filepath = filepath || "url.json";
  let filetype = path__default.default.extname(filepath);
  if (filetype != ".json") {
    console.log("Error: Config file must have .json extension");
    return;
  }
  if (fs__default.default.existsSync(filepath)) {
    console.log(`Error: web-static config already exists: ${filepath}`);
    console.log(`To create a new file, please specify the file name like: 'smartui config:create-web links.json'`);
    return;
  }
  fs__default.default.mkdirSync(path__default.default.dirname(filepath), { recursive: true });
  fs__default.default.writeFileSync(filepath, JSON.stringify(DEFAULT_WEB_STATIC_CONFIG, null, 2) + "\n");
  console.log(`Created web-static config: ${filepath}`);
}

// src/lib/env.ts
var env_default = () => {
  const {
    PROJECT_TOKEN = "",
    SMARTUI_CLIENT_API_URL = "https://api.lambdatest.com"
  } = process.env;
  return {
    PROJECT_TOKEN,
    SMARTUI_CLIENT_API_URL
  };
};
var httpClient = class {
  constructor({ SMARTUI_CLIENT_API_URL, PROJECT_TOKEN }) {
    this.axiosInstance = axios__default.default.create({
      baseURL: SMARTUI_CLIENT_API_URL,
      headers: { "projectToken": PROJECT_TOKEN }
    });
  }
  request(config) {
    return __async(this, null, function* () {
      return this.axiosInstance.request(config).then((response) => {
        return response.data;
      }).catch((error) => {
        if (error.response) {
          throw new Error(JSON.stringify(error.response.data));
        }
        if (error.request) {
          throw new Error(error.toJSON().message);
        }
        throw new Error(error.message);
      });
    });
  }
  auth() {
    return this.request({
      url: "/token/verify",
      method: "GET"
    });
  }
  createBuild({ branch, commitId, commitAuthor, commitMessage, githubURL }, config) {
    return this.request({
      url: "/build",
      method: "POST",
      data: {
        git: {
          branch,
          commitId,
          commitAuthor,
          commitMessage,
          githubURL
        },
        config
      }
    });
  }
  finalizeBuild(buildId) {
    return this.request({
      url: "/build",
      method: "DELETE",
      params: {
        buildId
      }
    });
  }
  uploadSnapshot(buildId, snapshot) {
    return this.request({
      url: `/builds/${buildId}/snapshot`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: { snapshot }
    });
  }
};
var ctx_default = (options) => {
  let env2 = env_default();
  let resolutions = [];
  let webConfig = DEFAULT_WEB_CONFIG;
  try {
    if (options.config) {
      webConfig = JSON.parse(fs__default.default.readFileSync(options.config, "utf-8"));
    }
    for (let resolution of webConfig.web.resolutions) {
      resolutions.push({ width: resolution[0], height: resolution[1] });
    }
  } catch (error) {
    throw new Error(error.message);
  }
  return {
    env: env2,
    client: new httpClient(env2),
    config: {
      browsers: webConfig.web.browsers,
      resolutions
    },
    git: {
      branch: "",
      commitId: "",
      commitAuthor: "",
      commitMessage: "",
      githubURL: ""
    },
    build: {
      id: "",
      projectId: "",
      url: ""
    },
    args: {}
  };
};
function executeCommand(command3) {
  let dst = process.cwd();
  try {
    return child_process.execSync(command3, {
      cwd: dst,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf-8"
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
var git_default = () => {
  const splitCharacter = "<##>";
  const prettyFormat = ["%h", "%H", "%s", "%f", "%b", "%at", "%ct", "%an", "%ae", "%cn", "%ce", "%N", ""];
  const command3 = 'git log -1 --pretty=format:"' + prettyFormat.join(splitCharacter) + '" && git rev-parse --abbrev-ref HEAD && git tag --contains HEAD';
  let res = executeCommand(command3).split(splitCharacter);
  var branchAndTags = res[res.length - 1].split("\n").filter((n) => n);
  var branch = branchAndTags[0];
  branchAndTags.slice(1);
  return {
    branch,
    commitId: res[0] || "",
    commitMessage: res[2] || "",
    commitAuthor: res[7] || ""
  };
};
var getGitInfo_default = (ctx) => {
  return {
    title: `Fetching git repo details`,
    task: (ctx2, task) => __async(void 0, null, function* () {
      try {
        ctx2.git = git_default();
        task.output = chalk3__default.default.gray(`branch: ${ctx2.git.branch}, commit: ${ctx2.git.commitId}, author: ${ctx2.git.commitAuthor}`);
        task.title = "Fetched git information";
      } catch (error) {
        console.error(error);
        task.output = chalk3__default.default.gray(`build name will be assigned randomly`);
        throw new Error("Not a git repository");
      }
    }),
    exitOnError: false,
    rendererOptions: { persistentOutput: true }
  };
};
var createBuild_default = (ctx) => {
  return {
    title: `Creating SmartUI build`,
    task: (ctx2, task) => __async(void 0, null, function* () {
      var _a, _b;
      try {
        let resp = yield ctx2.client.createBuild(ctx2.git, ctx2.config);
        let buildDetails = new URLSearchParams(new URL(resp.buildURL).search);
        ctx2.build = {
          id: (_a = buildDetails.get("buildid")) != null ? _a : "",
          projectId: (_b = buildDetails.get("projectid")) != null ? _b : "",
          url: resp.buildURL
        };
        task.output = chalk3__default.default.gray(`build url: ${resp.buildURL}`);
        task.title = "SmartUI build created";
      } catch (error) {
        throw new Error("SmartUI build creation failed");
      }
    }),
    rendererOptions: { persistentOutput: true }
  };
};

// src/tasks/exec.ts
var import_cross_spawn = __toESM(require_cross_spawn(), 1);
var exec_default = (ctx) => {
  return {
    title: `Executing '${ctx.args.execCommand.join(" ")}'`,
    task: (ctx2, task) => __async(void 0, null, function* () {
      const child = (0, import_cross_spawn.default)(ctx2.args.execCommand[0], ctx2.args.execCommand.slice(1), { stdio: "inherit" });
      return new Promise((resolve, reject) => {
        child.on("error", (error) => {
          task.output = chalk3__default.default.gray(`error: ${error.message}`);
          throw new Error(`Failed to start subprocess`);
        });
        child.on("close", (code, signal) => __async(void 0, null, function* () {
          if (code !== null) {
            task.output = chalk3__default.default.gray(`Child process exited with code ${code}`);
          } else if (signal !== null) {
            throw new Error(`Child process killed with signal ${signal}`);
          }
          resolve();
        }));
      });
    }),
    rendererOptions: { persistentOutput: true }
  };
};

// src/commander/exec.ts
var command = new commander.Command();
command.name("exec").description("Run test commands around SmartUI").argument("<command...>", "Command supplied for running tests").action(function(execCommand, _, command3) {
  return __async(this, null, function* () {
    var _a;
    let ctx = ctx_default(command3.optsWithGlobals());
    if (!which__default.default.sync(execCommand[0], { nothrow: true })) {
      console.log(`Error: Command not found "${execCommand[0]}"`);
      return;
    }
    ctx.args.execCommand = execCommand;
    let tasks = new listr2.Listr(
      [
        auth_default(),
        startServer_default(),
        getGitInfo_default(),
        createBuild_default(),
        exec_default(ctx)
        // showResults(ctx)
      ],
      {
        rendererOptions: {
          icon: {
            // [ListrDefaultRendererLogLevels.COMPLETED]: 'hey completed!'
            [listr2.ListrDefaultRendererLogLevels.OUTPUT]: `\u2192`
          },
          color: {
            // [ListrDefaultRendererLogLevels.COMPLETED]: (data): string => color.bgGreen(color.black(data)),
            [listr2.ListrDefaultRendererLogLevels.OUTPUT]: listr2.color.gray
          }
        }
      }
    );
    try {
      yield tasks.run(ctx);
    } catch (error) {
      console.log("\nRefer docs: https://www.lambdatest.com/support/docs/smart-visual-regression-testing/");
    }
    yield (_a = ctx.server) == null ? void 0 : _a.close();
    yield ctx.client.finalizeBuild(ctx.build.id);
  });
});
var exec_default2 = command;
var configWeb = new commander.Command();
var configStatic = new commander.Command();
configWeb.name("config:create-web").description("Create SmartUI Web config file").argument("[filepath]", "Optional config filepath").action(function(filepath, options) {
  return __async(this, null, function* () {
    createWebConfig(filepath);
  });
});
configStatic.name("config:web-static").description("Create Web Static config file").argument("[filepath]", "Optional config filepath").action(function(filepath, options) {
  return __async(this, null, function* () {
    createWebStaticConfig(filepath);
  });
});
var command2 = new commander.Command();
command2.name("capture").description("Capture screenshots of static sites").argument("<file>", "Web static config file").action(function(file, _, command3) {
  return __async(this, null, function* () {
    try {
      let ctx = ctx_default(command3.optsWithGlobals());
      if (!fs__default.default.existsSync(file)) {
        console.log(`Error: Config file ${file} not found.`);
        return;
      }
      ctx.staticConfig = JSON.parse(fs__default.default.readFileSync(file, "utf8"));
      let tasks = new listr2.Listr(
        [
          auth_default(ctx),
          getGitInfo_default(ctx),
          createBuild_default(ctx)
          // captureScreenshots(ctx),
          // showResults(ctx)
        ],
        {
          rendererOptions: {
            icon: {
              [listr2.ListrDefaultRendererLogLevels.OUTPUT]: `\u2192`
            },
            color: {
              [listr2.ListrDefaultRendererLogLevels.OUTPUT]: listr2.color.gray
            }
          }
        }
      );
      yield tasks.run(ctx);
    } catch (error) {
      console.log(error);
    }
  });
});
var capture_default = command2;

// src/commander/commander.ts
var program = new commander.Command();
program.name("smartui").description("CLI to help you run your SmartUI tests on LambdaTest platform").option("-c --config <filepath>", "Config file path").addCommand(exec_default2).addCommand(capture_default).addCommand(configWeb).addCommand(configStatic);
var commander_default = program;

// src/index.ts
env_default();
commander_default.parse();
