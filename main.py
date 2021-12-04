class WrittenText:
    def __init__(self, text):
        self.__text = text

    def render(self):
        return self.__text


class UnderlineText(WrittenText):
    def __init__(self, wrapped):
        self.__wrapped = wrapped

    def render(self):
        return "<u>{}</u>".format(self.__wrapped.render())


class BoldWrapper(WrittenText):
    def __init__(self, wrapped):
        self.__wrapped = wrapped

    def render(self):
        return "<b>{}</b>".format(self.__wrapped.render())

awal = WrittenText("Hai Apa Kabar?")
print(f"Awal : {awal.render()}")

akhir = BoldWrapper(UnderlineText(awal))
print(f"Akhir : {akhir.render()}")


