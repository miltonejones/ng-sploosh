#!/bin/bash

# Define the ports used by the applications
PORTS=(4201 4202 4203 4204 4205 4206 4207)

echo "Attempting to stop Angular apps by port number..."

for port in "${PORTS[@]}"; do
  # Find the Process ID (PID) listening on the current port
  PID=$(lsof -ti tcp:"$port")

  if [ -n "$PID" ]; then
    echo "Found process $PID on port $port. Killing it..."
    kill "$PID"
    if [ $? -eq 0 ]; then
      echo "Successfully killed process $PID."
    else
      echo "Failed to kill process $PID on port $port."
    fi
  else
    echo "No process found listening on port $port."
  fi
done

echo "Stop script finished."
