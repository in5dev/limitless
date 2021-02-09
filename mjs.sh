#!/bin/bash
for file in $(find 'esm' -name '*.js'); do
    MJS=${file/.js/.mjs}
    mv "$file" "build/${MJS:4}"
done