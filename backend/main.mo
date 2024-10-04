import Text "mo:base/Text";

import Array "mo:base/Array";
import Int "mo:base/Int";
import Order "mo:base/Order";

actor {
  stable var highScores : [(Text, Int)] = [];

  public func addScore(name : Text, score : Int) : async () {
    highScores := Array.sort(
      Array.append(highScores, [(name, score)]),
      func (a : (Text, Int), b : (Text, Int)) : Order.Order {
        Int.compare(b.1, a.1)
      }
    );
    if (highScores.size() > 10) {
      highScores := Array.subArray(highScores, 0, 10);
    };
  };

  public query func getHighScores() : async [(Text, Int)] {
    highScores
  };
}
