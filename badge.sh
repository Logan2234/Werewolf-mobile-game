#!/bin/bash

# Eslint badge

file="eslint_frontend_report.txt"
file+="eslint_backend_report.txt"

NBERR=$(grep -e "^ERROR" $file | wc -l)
NBWARN=$(grep -e "^WARNING" $file | wc -l)
color="green"
if [[ $NBERR > 0 ]]
then 
    color="red"
    else if [[ $NBWARN > 0 ]]
    then 
        color="orange"
    fi
fi
anybadge -o -l "eslint" -v "$NBERR $NBWARN" -c "$color" -f "eslint.svg"

# Cypress test badge

file="cypress_report.txt"
grep -e "All specs passed!" $file
if [[ $? -eq 0 ]]
then
    color="green"
else
    color="red"
fi
anybadge -o -l "Cypress tests" -c "$color" -f "cypress_test.svg"

# file="jest_report.txt"
# grep -e "29 passed" $file
# if [[ $? -eq 0 ]]
# then
#     color="green"
# else
#     color="red"
# fi
# anybadge -o -l "JEST" -v "$NBERR $NBWARN" -c "$color" -f "test.svg"
