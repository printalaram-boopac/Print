"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
let prismaClient = null;
function createSafePrisma() {
    try {
        prismaClient = new client_1.PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        });
    }
    catch (e) {
        console.warn('[AI Studio] Could not instantiate PrismaClient, fallback active:', e);
    }
    const dummyModelHandler = {
        findMany: async () => [],
        findFirst: async () => null,
        findUnique: async () => null,
        create: async (d) => d?.data ?? {},
        update: async (d) => d?.data ?? {},
        delete: async () => ({}),
        upsert: async (d) => d?.create ?? {},
        count: async () => 0,
        aggregate: async () => ({ _count: 0, _sum: {}, _avg: {} }),
    };
    if (!prismaClient) {
        return new Proxy({}, {
            get: (_, prop) => {
                if (prop === '$executeRawUnsafe' || prop === '$queryRawUnsafe') {
                    return async () => [];
                }
                if (prop === '$disconnect' || prop === '$connect') {
                    return async () => { };
                }
                return dummyModelHandler;
            },
        });
    }
    // Wrap prismaClient in a proxy to catch runtime DB connection errors gracefully
    return new Proxy(prismaClient, {
        get(target, prop) {
            if (prop === '$executeRawUnsafe' || prop === '$queryRawUnsafe') {
                return async (...args) => {
                    try {
                        return await target[prop](...args);
                    }
                    catch (err) {
                        console.warn(`[AI Studio] Prisma raw query error: ${err?.message || err}`);
                        return [];
                    }
                };
            }
            if (prop === '$disconnect' || prop === '$connect') {
                return async (...args) => {
                    try {
                        return await target[prop](...args);
                    }
                    catch (err) { }
                };
            }
            const model = target[prop];
            if (typeof model === 'object' && model !== null) {
                return new Proxy(model, {
                    get(mTarget, mProp) {
                        if (typeof mTarget[mProp] === 'function') {
                            return async (...args) => {
                                try {
                                    return await mTarget[mProp](...args);
                                }
                                catch (err) {
                                    console.warn(`[AI Studio] Prisma operation ${String(mProp)} failed: ${err?.message || err}`);
                                    const fnName = String(mProp);
                                    if (fnName === 'findMany')
                                        return [];
                                    if (fnName === 'findFirst' || fnName === 'findUnique')
                                        return null;
                                    if (fnName === 'count')
                                        return 0;
                                    if (fnName === 'create' || fnName === 'update')
                                        return args[0]?.data || {};
                                    return {};
                                }
                            };
                        }
                        return mTarget[mProp];
                    },
                });
            }
            return target[prop];
        },
    });
}
exports.prisma = createSafePrisma();
exports.default = exports.prisma;
