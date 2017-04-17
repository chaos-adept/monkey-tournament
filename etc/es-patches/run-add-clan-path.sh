#!/bin/bash
curl -d @add_clan_fields.json -l -X PUT http://localhost:9200/attempt/_mapping/attempt -H 'Content-Type: application/json'
curl http://localhost:9200/attempt/_mapping/attempt?pretty