import {
    CacheClient,
    CacheConfiguration,
    MemoryOptions,
    ModuleStore,
    RedisOptions,
    StoreType,
} from '@cbidigital/heron-common';

export const RedisCacheConfig = <ModuleStore>{
    type: StoreType.CACHE,
    name: 'redis-cache',
    config: <CacheConfiguration>{
        client: CacheClient.REDIS,
        config: <RedisOptions>{
            host: '127.0.0.01',
            port: 6879,
            db: 0,
            ttl: 10,
            password: 'dev@123',
        },
    },
};

export const MemoryCacheConfig = <ModuleStore>{
    type: StoreType.CACHE,
    name: 'memory-cache',
    isDefault: true,
    config: <CacheConfiguration>{
        client: CacheClient.MEMORY,
        config: <MemoryOptions>{
            max: 100,
            ttl: 10,
        },
    },
};
