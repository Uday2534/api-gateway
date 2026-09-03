-- WHY LUA?
--
-- Redis executes Lua scripts atomically.
--
-- No other client can modify the bucket while
-- this script is running.
--
-- This prevents race conditions when multiple
-- gateway instances consume tokens at the same
-- time.

local key = KEYS[1]

local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local bucket = redis.call('HMGET',
    key,
    'tokens',
    'lastRefill'
)

local tokens = bucket[1]
local lastRefill = bucket[2]

if not tokens then
    tokens = capacity
    lastRefill = now
else
    tokens = tonumber(tokens)
    lastRefill = tonumber(lastRefill)
end

local elapsed = now - lastRefill

local replenished =
    elapsed * refillRate

tokens =
    math.min(
        capacity,
        tokens + replenished
    )

if tokens < 1 then

    local retryAfter =
        math.ceil(
            (1 - tokens) / refillRate
        )

    redis.call(
        'HMSET',
        key,
        'tokens',
        tokens,
        'lastRefill',
        now
    )

    redis.call(
        'EXPIRE',
        key,
        3600
    )

    return {
        0,
        retryAfter,
        tokens
    }
end

tokens = tokens - 1

redis.call(
    'HMSET',
    key,
    'tokens',
    tokens,
    'lastRefill',
    now
)

redis.call(
    'EXPIRE',
    key,
    3600
)

return {
    1,
    0,
    tokens
}