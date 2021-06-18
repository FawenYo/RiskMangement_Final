import json
import random
from typing import List

MAX_LENGTH = 1000


data = {}


def init() -> None:
    global data
    with open("generator/data.json", "rb") as f:
        data = json.load(f)


def shuffle(str_list: List[str]) -> List[str]:
    random.shuffle(str_list)
    return str_list


def count_special(string: str) -> int:
    chars = [
        " ",
        "，",
        "。",
        "？",
        "；",
        "！",
        "：",
    ]
    length = 0
    for c in chars:
        length += string.count(c)
    return length


def can_end(string: str) -> bool:
    if len(string) < 2:
        return False
    if string[-1] == "。":
        return True
    if string[-1] == "？":
        return True
    return False


def generate(topic: str, min_len: int) -> str:
    global data
    init()
    if min_len > MAX_LENGTH:
        min_len = MAX_LENGTH
    shuffledFamous = shuffle(data.get("famous"))
    shuffledBullshit = shuffle(data.get("bullshit"))

    ret = ""
    hasTopic = False
    indent = "&nbsp;&nbsp;" * 4

    while len(ret) < min_len or not can_end(ret) or not hasTopic:
        x = random.randint(1, 100)
        if x < 5 and can_end(ret):
            ret += "<br><br>" + indent
            min_len += 10
        elif x < 27:
            if len(shuffledFamous) == 0:
                break
            f = shuffledFamous[0]
            shuffledFamous = shuffledFamous[1:]
            before = data.get("before")
            before = before[random.randint(0, len(before) - 1)]
            after = data.get("after")
            after = after[random.randint(0, len(after) - 1)]
            f = f.replace("a", before)
            f = f.replace("b", after)
            min_len += count_special(f)
            ret += f
        else:
            if len(shuffledBullshit) == 0:
                break
            b = shuffledBullshit[0]
            shuffledBullshit = shuffledBullshit[1:]
            if "x" in b:
                hasTopic = True
            b = b.replace("x", topic)
            min_len += count_special(b)
            ret += b
    ret = indent + ret
    return ret
