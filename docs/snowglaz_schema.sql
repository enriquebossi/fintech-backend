-- Schema for SnowGlaz.Club memberships and NFT cycles

-- Table of registered members
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    handle TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    status TEXT DEFAULT 'active'
);

-- Each membership cycle spans 28 days and is associated with a lunar cycle
CREATE TABLE membership_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id),
    cycle_start DATE NOT NULL,
    cycle_end DATE NOT NULL,
    lunar_cycle TEXT NOT NULL,
    nft_token_id TEXT,
    blockchain_tx TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Record of NFTs issued for each cycle
CREATE TABLE membership_nfts (
    id SERIAL PRIMARY KEY,
    member_id UUID REFERENCES members(id),
    cycle_id UUID REFERENCES membership_cycles(id),
    token_id TEXT,
    token_uri TEXT,
    tx_hash TEXT,
    issued_at TIMESTAMP DEFAULT NOW()
);
