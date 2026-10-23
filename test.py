s1 = 'abcadefea'

# set1 = set(s1)

pr = ''

for i in s1:
    if i in pr:
        break
    pr += i
    
print(pr)