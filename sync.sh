#!/bin/bash
git stash
git pull
git reset HEAD --hard
npm install --save raspi raspi-serial