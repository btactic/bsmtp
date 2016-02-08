#!/bin/bash

BASEPATH=$(pwd)

for file in $(find -name \*.tex); do
    cd $(dirname $file)
    echo "Compiling $file"
    pdflatex $(basename $file) > /dev/null 2>&1
    pdflatex $(basename $file) > /dev/null 2>&1
    rm *.{aux,log,out,toc}
    cd $BASEPATH
done
