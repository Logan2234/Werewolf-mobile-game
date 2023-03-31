#!/bin/bash

# Eslint badge

files=$(find . -name "eslint*.txt")

NBERR=0
NBWARN=0

for file in $files; do
    NBERR=$((NBERR + `grep -e "^ERROR" $file | wc -l`))
    NBWARN=$((NBWARN + `grep -e "^WARNING" $file | wc -l`))
done

color="green"
if [[ $NBERR > 0 ]]; then
    color="red"
else
    if [[ $NBWARN > 0 ]]; then
        color="orange"
    fi
fi
anybadge -o -l "eslint" -v "$NBERR $NBWARN" -c "$color" -f "eslint.svg"

# Cypress test badge

file="cypress_report.txt"
grep -e "All specs passed!" $file
if [[ $? -eq 0 ]]; then
    color="green"
    anybadge -o -l "Cypress tests" -v "OK" -c "$color" -f "cypress_test.svg"
else
    color="red"
    anybadge -o -l "Cypress tests" -v "KO" -c "$color" -f "cypress_test.svg"
fi

file="jest_report.txt"
grep -e "failed" $file
if [[ $? -eq 0 ]]
then
    color="red"
    anybadge -o -l "JEST" -v "KO" -c "$color" -f "jest_test.svg"
else
    color="green"
    anybadge -o -l "JEST" -v "OK" -c "$color" -f "jest_test.svg"
fi
