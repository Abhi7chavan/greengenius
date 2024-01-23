#master table infotmationtype sql query

"""
CREATE TABLE meta.informationtype (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(255) NOT NULL
);


INSERT INTO meta.informationtype (type) VALUES 
    ('electric'),
    ('water'),
    ('weather');
"""