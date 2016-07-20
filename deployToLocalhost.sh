#!/bin/bash
echo 'Deploy to localhost begun'
rsync -av --exclude='node_modules' --exclude='.git' --exclude='.idea' --exclude='README.md' --exclude='deployToProd.sh' --exclude='ignore' ./ ~/Sites/madnz/
open -a Safari http://localhost/~adrian/madnz
echo 'Deploy to localhost completed'