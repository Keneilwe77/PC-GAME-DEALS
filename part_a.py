
import json
from pathlib import Path


def load_games():
    """Load game data from deals.json."""
    file_path = Path(__file__).with_name("deals.json")

    with file_path.open("r", encoding="utf-8") as file:
        return json.load(file)


def is_on_sale(game):
    """Return True if the sale price is lower than normal price."""
    return game["salePrice"] < game["normalPrice"]


def get_games_on_sale(games):
    """Return only games that are currently on sale."""
    return [game for game in games if is_on_sale(game)]


def calculate_discount(game):
    """Calculate the discount as a whole-number percentage."""
    normal_price = game["normalPrice"]

    if normal_price <= 0 or not is_on_sale(game):
        return 0

    discount = (
        (normal_price - game["salePrice"])
        / normal_price
    ) * 100

    return round(discount)


def get_cheapest_game(games):
    """Find the game with the lowest current price."""
    if not games:
        return None

    return min(
        games,
        key=lambda game: (
            game["salePrice"]
            if is_on_sale(game)
            else game["normalPrice"]
        )
    )


def search_games(games, search_word):
    """Search game titles, ignoring capitalisation."""
    word = search_word.strip().casefold()

    if not word:
        return []

    return [
        game for game in games
        if word in game["title"].casefold()
    ]


def current_price(game):
    """Return the price the customer would currently pay."""
    if is_on_sale(game):
        return game["salePrice"]

    return game["normalPrice"]


def main():
    games = load_games()

    print("GAMES CURRENTLY ON SALE")
    for game in get_games_on_sale(games):
        print(
            f'{game["title"]}: '
            f'{calculate_discount(game)}% off'
        )

    cheapest = get_cheapest_game(games)

    print("\nCHEAPEST GAME")
    if cheapest:
        print(
            f'{cheapest["title"]}: '
            f'R{current_price(cheapest):.2f}'
        )

    print('\nSEARCH RESULTS FOR "hol"')
    for game in search_games(games, "hol"):
        print(game["title"])


if __name__ == "__main__":
    main()
