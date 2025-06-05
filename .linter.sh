#!/bin/bash
cd /home/kavia/workspace/code-generation/reactweathernow-29-6f5d177b/reactweathernow
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

