export interface Question {
  id: number;
  text: string;
  type: "normal" | "friends";
}

export const questions: Question[] = [
  // 🌙 I. Tình yêu, người từng thương & những điều chưa nói (1–40)
  {
    id: 1,
    text: "Hãy kể về giấc mơ gần nhất mày mơ về một người từng làm trái tim mày rung động.",
    type: "normal"
  },
  {
    id: 2,
    text: "Nếu được gặp lại một người từng rất quan trọng trong đời trong 10 phút, mày sẽ nói gì?",
    type: "normal"
  },
  {
    id: 3,
    text: "Người đầu tiên khiến mày biết cảm giác nhớ một người là ai?",
    type: "normal"
  },
  {
    id: 4,
    text: "Có ai mà đến bây giờ mày vẫn nghĩ: “Nếu lúc đó khác đi, có lẽ mọi chuyện đã khác” không?",
    type: "normal"
  },
  {
    id: 5,
    text: "Lần đau lòng nhất của mày vì một người là khi nào?",
    type: "normal"
  },
  {
    id: 6,
    text: "Có một tin nhắn nào mày từng viết rất lâu nhưng chưa bao giờ gửi không?",
    type: "normal"
  },
  {
    id: 7,
    text: "Nếu có thể nghe một sự thật từ người từng thương mà không bị tổn thương, mày muốn biết điều gì?",
    type: "normal"
  },
  {
    id: 8,
    text: "Một người từng rời đi đã dạy cho mày bài học gì?",
    type: "normal"
  },
  {
    id: 9,
    text: "Mày có còn giữ một món đồ, tấm ảnh hay ký ức nào về một người đặc biệt không?",
    type: "normal"
  },
  {
    id: 10,
    text: "Lần cuối cùng mày khóc vì tình cảm là khi nào?",
    type: "normal"
  },
  {
    id: 11,
    text: "Mày từng rung động vì điều nhỏ nhặt nhất nào ở một người?",
    type: "normal"
  },
  {
    id: 12,
    text: "Có một người mày chưa từng yêu nhưng lại nhớ rất lâu không?",
    type: "normal"
  },
  {
    id: 13,
    text: "Một người làm điều gì sẽ khiến mày rung động ngay lập tức?",
    type: "normal"
  },
  {
    id: 14,
    text: "Mày nghĩ mình yêu bằng trái tim hay lý trí nhiều hơn?",
    type: "normal"
  },
  {
    id: 15,
    text: "Điều tồi tệ nhất mày từng làm trong một mối quan hệ là gì?",
    type: "normal"
  },
  {
    id: 16,
    text: "Điều gì khiến mày cảm thấy mình không đủ tốt trong tình yêu?",
    type: "normal"
  },
  {
    id: 17,
    text: "Mày đã bao giờ giả vờ hết yêu dù trong lòng vẫn còn rất nhiều cảm xúc chưa?",
    type: "normal"
  },
  {
    id: 18,
    text: "Một câu nói trong chuyện tình cảm mà mày nhớ đến tận bây giờ là gì?",
    type: "normal"
  },
  {
    id: 19,
    text: "Mày có tin rằng có những người sinh ra để gặp nhưng không phải để ở lại không?",
    type: "normal"
  },
  {
    id: 20,
    text: "Một mối quan hệ kết thúc mà đến giờ mày vẫn chưa hiểu lý do là gì?",
    type: "normal"
  },
  {
    id: 21,
    text: "Nếu người từng làm mày đau quay lại và thật sự thay đổi, mày có cho họ cơ hội không?",
    type: "normal"
  },
  {
    id: 22,
    text: "Điều mày chưa từng đủ can đảm nói với người mình từng yêu nhất là gì?",
    type: "normal"
  },
  {
    id: 23,
    text: "Điều mày nhớ nhất ở một người đã rời đi là gì?",
    type: "normal"
  },
  {
    id: 24,
    text: "Có một cái tên nào chỉ cần nghe lại là cảm xúc trong mày thay đổi không?",
    type: "normal"
  },
  {
    id: 25,
    text: "Mày từng chấp nhận điều gì trong tình yêu dù biết mình đang tổn thương?",
    type: "normal"
  },
  {
    id: 26,
    text: "Nếu được xem lại một ngày trong chuyện tình cảm như một bộ phim, mày muốn xem ngày nào?",
    type: "normal"
  },
  {
    id: 27,
    text: "Mày nghĩ mình từng làm tổn thương ai mà đến giờ vẫn còn cảm thấy có lỗi không?",
    type: "normal"
  },
  {
    id: 28,
    text: "Người từng khiến mày yêu nhiều nhất đã thay đổi con người mày như thế nào?",
    type: "normal"
  },
  {
    id: 29,
    text: "Điều gì khiến mày sợ nhất khi bắt đầu một mối quan hệ mới?",
    type: "normal"
  },
  {
    id: 30,
    text: "Mày nghĩ một người có thể quên hoàn toàn người mình từng rất yêu không?",
    type: "normal"
  },
  {
    id: 31,
    text: "Mày nghĩ điều gì đau hơn: yêu một người không thể có được hay đánh mất người từng thuộc về mình?",
    type: "normal"
  },
  {
    id: 32,
    text: "Nếu có thể quay về một khoảnh khắc trong chuyện tình cảm để thay đổi, mày sẽ chọn khoảnh khắc nào?",
    type: "normal"
  },
  {
    id: 33,
    text: "Có điều gì mày đã tha thứ cho người khác nhưng chưa từng tha thứ cho bản thân không?",
    type: "normal"
  },
  {
    id: 34,
    text: "Một người từng khiến mày thay đổi cách nhìn về tình yêu như thế nào?",
    type: "normal"
  },
  {
    id: 35,
    text: "Điều gì mày sợ nhất khi phải mở lòng với một người mới?",
    type: "normal"
  },
  {
    id: 36,
    text: "Mày có nghĩ rằng đôi khi mình nhớ một ký ức hơn là nhớ chính con người đó không?",
    type: "normal"
  },
  {
    id: 37,
    text: "Nếu được hỏi người từng thương một câu và họ phải trả lời thật, mày sẽ hỏi gì?",
    type: "normal"
  },
  {
    id: 38,
    text: "Điều gì khiến mày nhận ra mình đã thật sự buông bỏ một người?",
    type: "normal"
  },
  {
    id: 39,
    text: "Mày có nghĩ mình từng bỏ lỡ một người vì bản thân chưa đủ trưởng thành không?",
    type: "normal"
  },
  {
    id: 40,
    text: "Tình yêu lý tưởng trong suy nghĩ của mày trông như thế nào?",
    type: "normal"
  },

  // 🧠 II. Những suy nghĩ giấu kín & góc tối bên trong (41–70)
  {
    id: 41,
    text: "Có điều gì mày đang chịu đựng một mình mà không ai biết không?",
    type: "normal"
  },
  {
    id: 42,
    text: "Mày có thường giả vờ ổn trước mặt mọi người không?",
    type: "normal"
  },
  {
    id: 43,
    text: "Lần gần nhất mày cảm thấy cô đơn dù xung quanh có rất nhiều người là khi nào?",
    type: "normal"
  },
  {
    id: 44,
    text: "Điều gì trong quá khứ khiến mày vẫn còn day dứt đến hôm nay?",
    type: "normal"
  },
  {
    id: 45,
    text: "Một bí mật về bản thân mà không ai nghĩ mày có là gì?",
    type: "normal"
  },
  {
    id: 46,
    text: "Mày có từng cảm thấy mình không đủ giỏi, không đủ đẹp hoặc không đủ giá trị không?",
    type: "normal"
  },
  {
    id: 47,
    text: "Điều gì khiến mày suy nghĩ nhiều nhất vào ban đêm?",
    type: "normal"
  },
  {
    id: 48,
    text: "Có một phiên bản nào của bản thân trong quá khứ mà mày rất nhớ không?",
    type: "normal"
  },
  {
    id: 49,
    text: "Nếu được ôm lấy chính mình 5 năm trước, mày sẽ nói gì?",
    type: "normal"
  },
  {
    id: 50,
    text: "Điều gì mày luôn muốn nghe từ một người quan trọng nhưng chưa từng được nghe?",
    type: "normal"
  },
  {
    id: 51,
    text: "Mày đang sống cuộc đời mình mong muốn hay cuộc đời người khác mong đợi?",
    type: "normal"
  },
  {
    id: 52,
    text: "Một nỗi sợ mà đến giờ mày chưa từng kể với ai là gì?",
    type: "normal"
  },
  {
    id: 53,
    text: "Có thời điểm nào mày cảm thấy hoàn toàn mất phương hướng không?",
    type: "normal"
  },
  {
    id: 54,
    text: "Điều mày ghét nhất ở bản thân là gì?",
    type: "normal"
  },
  {
    id: 55,
    text: "Điều gì ở bản thân khiến mày tự hào nhưng ít khi thể hiện?",
    type: "normal"
  },
  {
    id: 56,
    text: "Một thất bại nào đã thay đổi hoàn toàn con người mày?",
    type: "normal"
  },
  {
    id: 57,
    text: "Nếu được xoá một ký ức, mày sẽ chọn ký ức nào?",
    type: "normal"
  },
  {
    id: 58,
    text: "Nếu được sống lại một ngày hạnh phúc nhất, mày sẽ chọn ngày nào?",
    type: "normal"
  },
  {
    id: 59,
    text: "Điều gì mày vẫn đang cố học cách tha thứ cho chính mình?",
    type: "normal"
  },
  {
    id: 60,
    text: "Điều gì khiến mày khó mở lòng với người khác?",
    type: "normal"
  },
  {
    id: 61,
    text: "Mày từng cảm thấy bị bỏ rơi chưa? Cảm giác đó đã thay đổi mày ra sao?",
    type: "normal"
  },
  {
    id: 62,
    text: "Có ai mà mày rất muốn nghe câu: “Tao tự hào về mày” từ họ không?",
    type: "normal"
  },
  {
    id: 63,
    text: "Biến cố nào khiến mày trưởng thành nhất?",
    type: "normal"
  },
  {
    id: 64,
    text: "Điều gì làm mày sợ nhất khi nghĩ về tương lai?",
    type: "normal"
  },
  {
    id: 65,
    text: "Nếu ngày mai biến mất khỏi thế giới này, điều gì khiến mày tiếc nuối nhất?",
    type: "normal"
  },
  {
    id: 66,
    text: "Mày nghĩ điều gì ở bản thân mà mọi người thường hiểu sai?",
    type: "normal"
  },
  {
    id: 67,
    text: "Có một câu xin lỗi nào mày luôn muốn nghe nhưng chưa bao giờ nhận được không?",
    type: "normal"
  },
  {
    id: 68,
    text: "Điều gì khiến mày cảm thấy mình thực sự cô độc?",
    type: "normal"
  },
  {
    id: 69,
    text: "Có một cảm xúc nào mày luôn cố che giấu khỏi mọi người không?",
    type: "normal"
  },
  {
    id: 70,
    text: "Điều gì là vết thương sâu nhất mà thời gian vẫn chưa chữa lành được?",
    type: "normal"
  },

  // 🌌 III. Cuộc đời, tuổi trẻ & tương lai (71–100)
  {
    id: 71,
    text: "Điều tiếc nuối lớn nhất của mày trong tuổi trẻ đến hiện tại là gì?",
    type: "normal"
  },
  {
    id: 72,
    text: "Nếu biết chắc chắn sẽ không thất bại, điều đầu tiên mày muốn làm là gì?",
    type: "normal"
  },
  {
    id: 73,
    text: "Thành công theo mày là có tiền, có người yêu thương hay có sự bình yên?",
    type: "normal"
  },
  {
    id: 74,
    text: "Mày đang đánh đổi điều gì ở tuổi trẻ để có tương lai mong muốn?",
    type: "normal"
  },
  {
    id: 75,
    text: "Một quyết định nhỏ nào trong quá khứ đã thay đổi con người mày nhiều nhất?",
    type: "normal"
  },
  {
    id: 76,
    text: "Nếu gặp lại chính mình lúc 18 tuổi, mày sẽ nói điều gì?",
    type: "normal"
  },
  {
    id: 77,
    text: "Mày sợ việc lớn lên hay sợ thời gian trôi quá nhanh hơn?",
    type: "normal"
  },
  {
    id: 78,
    text: "Điều gì khiến mày vẫn muốn tiếp tục cố gắng dù có những lúc rất mệt mỏi?",
    type: "normal"
  },
  {
    id: 79,
    text: "Mày nghĩ một cuộc đời hạnh phúc và một cuộc đời có ý nghĩa khác nhau như thế nào?",
    type: "normal"
  },
  {
    id: 80,
    text: "Một điều mày muốn làm trước khi quá muộn là gì?",
    type: "normal"
  },
  {
    id: 81,
    text: "Mày muốn được người khác nhớ đến như một người như thế nào?",
    type: "normal"
  },
  {
    id: 82,
    text: "Nếu hôm nay là ngày cuối cùng của cuộc đời, người đầu tiên mày muốn gặp là ai?",
    type: "normal"
  },
  {
    id: 83,
    text: "Điều gì trong cuộc sống hiện tại khiến mày biết ơn nhất?",
    type: "normal"
  },
  {
    id: 84,
    text: "Có một ước mơ nào mày từng từ bỏ nhưng trong lòng vẫn còn tiếc không?",
    type: "normal"
  },
  {
    id: 85,
    text: "Điều mày nghĩ mình sẽ hối tiếc nhất khi về già là gì?",
    type: "normal"
  },
  {
    id: 86,
    text: "Nếu được nhìn thấy bản thân 10 năm sau trong 1 phút, mày muốn thấy điều gì?",
    type: "normal"
  },
  {
    id: 87,
    text: "Cái giá đau nhất để trưởng thành theo mày là gì?",
    type: "normal"
  },
  {
    id: 88,
    text: "Có điều gì mày đang chờ đợi nhưng chưa đủ can đảm để bắt đầu không?",
    type: "normal"
  },
  {
    id: 89,
    text: "Điều quan trọng nhất mày cần học trước tuổi 30 là gì?",
    type: "normal"
  },
  {
    id: 90,
    text: "Nếu phải chọn một người hoặc một điều để bảo vệ cả đời, mày sẽ chọn gì?",
    type: "normal"
  },
  {
    id: 91,
    text: "Hạnh phúc theo mày là một đích đến hay những khoảnh khắc nhỏ trên hành trình?",
    type: "normal"
  },
  {
    id: 92,
    text: "Sau tất cả những gì đã trải qua, bài học lớn nhất mày học được về bản thân là gì?",
    type: "normal"
  },
  {
    id: 93,
    text: "Nếu chỉ còn một câu để nói với những người mày yêu thương, mày sẽ nói gì?",
    type: "friends" // Adding friends class for warm group sharing on this specific deep-talk prompt
  },
  {
    id: 94,
    text: "Điều gì khiến một ngày bình thường trở thành một ký ức không thể quên?",
    type: "normal"
  },
  {
    id: 95,
    text: "Mày nghĩ điều gì sẽ tồn tại sau khi một con người rời đi?",
    type: "normal"
  },
  {
    id: 96,
    text: "Nếu được biết trước một sự thật về tương lai, mày có muốn biết không? Vì sao?",
    type: "normal"
  },
  {
    id: 97,
    text: "Mày nghĩ điều gì là ý nghĩa lớn nhất của việc được sống?",
    type: "normal"
  },
  {
    id: 98,
    text: "Có điều gì hiện tại mày đang có nhưng sợ một ngày nào đó sẽ mất đi không?",
    type: "normal"
  },
  {
    id: 99,
    text: "Nếu có thể cảm ơn một người đã thay đổi cuộc đời mình, đó là ai và vì sao?",
    type: "friends" // Highly interactive group reflection prompt
  },
  {
    id: 100,
    text: "Điều chân thật nhất về con người mày mà rất ít người biết là gì?",
    type: "normal"
  }
];
