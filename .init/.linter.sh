#!/bin/bash
cd /home/kavia/workspace/code-generation/mood-tracker-and-visualizer-142201-142228/mood_tracker_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

