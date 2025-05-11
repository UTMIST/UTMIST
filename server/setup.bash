#!/bin/bash

# Django environment Setup Script

python_setup() {
    echo "Setting up Python environment..."

    if command -v python3 &> /dev/null; then
        echo "Python3 is installed"
    else
        echo "Python is not installed, please install Python3"
        exit 1
    fi

    if command -v pip3 &> /dev/null; then
        echo "Pip is installed"
    else
        echo "Pip is not installed"
        echo "Installing pip..."
        curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
        python3 get-pip.py
        if [ $? -ne 0 ]; then
            echo "Failed to install pip. Please install it manually."
            exit 1
        fi
        rm get-pip.py
        echo "Pip installed successfully"
    fi
}

launch_venv() {
    echo "Launching virtual environment..."
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv
        if [ $? -ne 0 ]; then
            echo "Failed to create virtual environment. Please create it manually."
            exit 1
        fi
        echo "Virtual environment created successfully"
    else
        echo "Virtual environment already exists"
    fi

    source venv/bin/activate

    if [ ! -f "requirements.txt" ]; then
        echo "requirements.txt not found. Please create it."
        exit 1
    fi

    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "Failed to install requirements. Please check requirements.txt."
        exit 1
    fi

}

main() {
    echo "Starting Django environment setup..."
    python_setup
    launch_venv
    echo "Django environment setup completed successfully"
    echo "To activate the virtual environment, run 'source venv/bin/activate'"
    echo "To deactivate the virtual environment, run 'deactivate'"
}

main
