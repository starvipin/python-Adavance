
def reverse_string(s):
    stri = ""
    count = len(s)

    while count > 0:
        stri = stri + s[count - 1]
        count -= 1

    if stri == s:
        print("Palindrome")
    else:
        print("Not Palindrome")

s = input("str := ")
reverse_string(s)
