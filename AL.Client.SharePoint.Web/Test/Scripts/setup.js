﻿function assert(expr, msg) {
    if (!expr) throw new Error(msg || 'failed');
}

mocha.setup("bdd");