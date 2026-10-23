str1 = input("enter first string:= ")
str2 = input("enter first string:= ")

str1.lower
str2.lower

s1 = sorted(str1)
s2 = sorted(str2)

if s1 == s2:
    print("Valid Anagram")
else:
    print("not Valid Anagram")

