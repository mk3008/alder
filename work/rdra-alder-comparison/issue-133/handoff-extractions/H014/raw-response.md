{
  "packet_id": "H014",
  "facts": [
    {
      "id": "F1",
      "meaning": "社員は物品と10万円未満の金額を入力して少額購入申請を提出する。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 3,
          "line_end": 3,
          "quote": "社員が10万円未満の金額と物品を入力して申請を提出する。"
        },
        {
          "line_start": 4,
          "line_end": 4,
          "quote": "社員が10万円未満の金額と物品を入力して申請を提出する。"
        },
        {
          "line_start": 5,
          "line_end": 5,
          "quote": "社員が10万円未満の金額と物品を入力して申請を提出する。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "社員が10万円未満の金額と物品を入力して申請を提出する。"
        },
        {
          "line_start": 110,
          "line_end": 110,
          "quote": "10万円未満または10万円以上の物品購入を申請"
        },
        {
          "line_start": 116,
          "line_end": 116,
          "quote": "金額が10万円未満なら課長"
        },
        {
          "line_start": 129,
          "line_end": 129,
          "quote": "社員が物品と金額を申請し"
        }
      ]
    },
    {
      "id": "F2",
      "meaning": "社員は物品と10万円以上の金額を入力して高額購入申請を提出する。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 15,
          "line_end": 15,
          "quote": "社員が10万円以上の金額と物品を入力して申請を提出する。"
        },
        {
          "line_start": 16,
          "line_end": 16,
          "quote": "社員が10万円以上の金額と物品を入力して申請を提出する。"
        },
        {
          "line_start": 17,
          "line_end": 17,
          "quote": "社員が10万円以上の金額と物品を入力して申請を提出する。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "社員が10万円以上の金額と物品を入力して申請を提出する。"
        },
        {
          "line_start": 110,
          "line_end": 110,
          "quote": "10万円未満または10万円以上の物品購入を申請"
        },
        {
          "line_start": 134,
          "line_end": 134,
          "quote": "少額申請は10万円未満、高額申請は10万円以上として扱う。"
        }
      ]
    },
    {
      "id": "F3",
      "meaning": "申請金額は0以上の整数、物品名は空でないことを検証し、不正な入力は400で拒否する。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 6,
          "line_end": 6,
          "quote": "金額が0以上の整数で物品名が空でないことを確認し、不正入力は400で拒否する。"
        },
        {
          "line_start": 7,
          "line_end": 7,
          "quote": "金額が0以上の整数で物品名が空でないことを確認し、不正入力は400で拒否する。"
        },
        {
          "line_start": 8,
          "line_end": 8,
          "quote": "金額が0以上の整数で物品名が空でないことを確認し、不正入力は400で拒否する。"
        },
        {
          "line_start": 18,
          "line_end": 18,
          "quote": "金額が0以上の整数で物品名が空でないことを確認し、不正入力は400で拒否する。"
        },
        {
          "line_start": 86,
          "line_end": 86,
          "quote": "申請金額は0以上の整数で物品名は空でないことを検証する。不正な入力は400で拒否する。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "金額が0以上の整数で物品名が空でないことを確認し、不正入力は400で拒否する。"
        },
        {
          "line_start": 116,
          "line_end": 116,
          "quote": "TypeScriptで申請入力の検証"
        },
        {
          "line_start": 134,
          "line_end": 134,
          "quote": "申請金額は0以上の整数で物品名は空でないことを検証する。不正な入力は400で拒否する。"
        }
      ]
    },
    {
      "id": "F4",
      "meaning": "入力条件を満たす少額申請には一意の申請IDを付け、金額と物品をpendingで登録し、課長の決裁対象にする。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 9,
          "line_end": 9,
          "quote": "一意の申請IDを付け、金額と物品をpendingで記録して課長の決裁対象にする。"
        },
        {
          "line_start": 10,
          "line_end": 10,
          "quote": "一意の申請IDを付け、金額と物品をpendingで記録して課長の決裁対象にする。"
        },
        {
          "line_start": 11,
          "line_end": 11,
          "quote": "一意の申請IDを付け、金額と物品をpendingで記録して課長の決裁対象にする。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "一意の申請IDを付け、金額と物品をpendingで記録して課長の決裁対象にする。"
        },
        {
          "line_start": 135,
          "line_end": 135,
          "quote": "入力条件を満たす申請に一意の申請IDを付け、金額と物品を決裁待ち（pending）として登録する。10万円未満は課長"
        },
        {
          "line_start": 146,
          "line_end": 146,
          "quote": "少額申請を承認待ちで登録し、課長の決裁対象にする。"
        }
      ]
    },
    {
      "id": "F5",
      "meaning": "入力条件を満たす高額申請には一意の申請IDを付け、金額と物品をpendingで登録し、部長の決裁対象にする。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 19,
          "line_end": 19,
          "quote": "一意の申請IDを付け、金額と物品をpendingで記録して部長の決裁対象にする。"
        },
        {
          "line_start": 20,
          "line_end": 20,
          "quote": "一意の申請IDを付け、金額と物品をpendingで記録して部長の決裁対象にする。"
        },
        {
          "line_start": 21,
          "line_end": 21,
          "quote": "一意の申請IDを付け、金額と物品をpendingで記録して部長の決裁対象にする。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "一意の申請IDを付け、金額と物品をpendingで記録して部長の決裁対象にする。"
        },
        {
          "line_start": 135,
          "line_end": 135,
          "quote": "10万円以上は部長の決裁対象にし"
        },
        {
          "line_start": 147,
          "line_end": 147,
          "quote": "高額申請を承認待ちで登録し、部長の決裁対象にする。"
        }
      ]
    },
    {
      "id": "F6",
      "meaning": "申請登録が正常な場合、201と申請IDおよびpendingを返す。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 12,
          "line_end": 12,
          "quote": "正常時は201と申請IDおよびpendingを受け取る。"
        },
        {
          "line_start": 13,
          "line_end": 13,
          "quote": "正常時は201と申請IDおよびpendingを受け取る。"
        },
        {
          "line_start": 14,
          "line_end": 14,
          "quote": "正常時は201と申請IDおよびpendingを受け取る。"
        },
        {
          "line_start": 22,
          "line_end": 22,
          "quote": "正常時は201と申請IDおよびpendingを受け取る。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "正常時は201と申請IDおよびpendingを受け取る。"
        },
        {
          "line_start": 135,
          "line_end": 135,
          "quote": "正常時は201と申請IDおよびpendingを返す。"
        }
      ]
    },
    {
      "id": "F7",
      "meaning": "決裁対象は申請IDで特定し、少額では10万円未満かつpending、高額では10万円以上かつpendingであることを確認する。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 23,
          "line_end": 23,
          "quote": "IDで申請を特定し、10万円未満でpendingかを確認する。"
        },
        {
          "line_start": 24,
          "line_end": 24,
          "quote": "IDで申請を特定し、10万円未満でpendingかを確認する。"
        },
        {
          "line_start": 25,
          "line_end": 25,
          "quote": "IDで申請を特定し、10万円未満でpendingかを確認する。"
        },
        {
          "line_start": 26,
          "line_end": 26,
          "quote": "IDで申請を特定し、10万円未満でpendingかを確認する。"
        },
        {
          "line_start": 27,
          "line_end": 27,
          "quote": "IDで申請を特定し、10万円未満でpendingかを確認する。"
        },
        {
          "line_start": 28,
          "line_end": 28,
          "quote": "IDで申請を特定し、10万円未満でpendingかを確認する。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "IDで申請を特定し、10万円未満でpendingかを確認する。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "IDで申請を特定し、10万円以上でpendingかを確認する。"
        },
        {
          "line_start": 139,
          "line_end": 139,
          "quote": "決裁対象の購入申請がpendingのときだけ承認または却下できる。"
        },
        {
          "line_start": 38,
          "line_end": 38,
          "quote": "IDで申請を特定し、10万円以上でpendingかを確認する。"
        },
        {
          "line_start": 39,
          "line_end": 39,
          "quote": "IDで申請を特定し、10万円以上でpendingかを確認する。"
        },
        {
          "line_start": 40,
          "line_end": 40,
          "quote": "IDで申請を特定し、10万円以上でpendingかを確認する。"
        },
        {
          "line_start": 41,
          "line_end": 41,
          "quote": "IDで申請を特定し、10万円以上でpendingかを確認する。"
        },
        {
          "line_start": 42,
          "line_end": 42,
          "quote": "IDで申請を特定し、10万円以上でpendingかを確認する。"
        },
        {
          "line_start": 43,
          "line_end": 43,
          "quote": "IDで申請を特定し、10万円以上でpendingかを確認する。"
        }
      ]
    },
    {
      "id": "F8",
      "meaning": "存在しない申請IDによる決裁は404で拒否する。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 23,
          "line_end": 23,
          "quote": "存在しないIDは404"
        },
        {
          "line_start": 24,
          "line_end": 24,
          "quote": "存在しないIDは404"
        },
        {
          "line_start": 25,
          "line_end": 25,
          "quote": "存在しないIDは404"
        },
        {
          "line_start": 26,
          "line_end": 26,
          "quote": "存在しないIDは404"
        },
        {
          "line_start": 27,
          "line_end": 27,
          "quote": "存在しないIDは404"
        },
        {
          "line_start": 28,
          "line_end": 28,
          "quote": "存在しないIDは404"
        },
        {
          "line_start": 38,
          "line_end": 38,
          "quote": "存在しないIDは404"
        },
        {
          "line_start": 39,
          "line_end": 39,
          "quote": "存在しないIDは404"
        },
        {
          "line_start": 40,
          "line_end": 40,
          "quote": "存在しないIDは404"
        },
        {
          "line_start": 41,
          "line_end": 41,
          "quote": "存在しないIDは404"
        },
        {
          "line_start": 42,
          "line_end": 42,
          "quote": "存在しないIDは404"
        },
        {
          "line_start": 43,
          "line_end": 43,
          "quote": "存在しないIDは404"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "存在しないIDは404"
        },
        {
          "line_start": 138,
          "line_end": 138,
          "quote": "存在しないIDは404で拒否する。"
        }
      ]
    },
    {
      "id": "F9",
      "meaning": "申請金額と決裁者の役割が一致しなければ403で拒否する。10万円未満は課長、10万円以上は部長が決裁できる。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 23,
          "line_end": 23,
          "quote": "権限外は403"
        },
        {
          "line_start": 24,
          "line_end": 24,
          "quote": "権限外は403"
        },
        {
          "line_start": 25,
          "line_end": 25,
          "quote": "権限外は403"
        },
        {
          "line_start": 26,
          "line_end": 26,
          "quote": "権限外は403"
        },
        {
          "line_start": 27,
          "line_end": 27,
          "quote": "権限外は403"
        },
        {
          "line_start": 28,
          "line_end": 28,
          "quote": "権限外は403"
        },
        {
          "line_start": 38,
          "line_end": 38,
          "quote": "権限外は403"
        },
        {
          "line_start": 39,
          "line_end": 39,
          "quote": "権限外は403"
        },
        {
          "line_start": 40,
          "line_end": 40,
          "quote": "権限外は403"
        },
        {
          "line_start": 41,
          "line_end": 41,
          "quote": "権限外は403"
        },
        {
          "line_start": 42,
          "line_end": 42,
          "quote": "権限外は403"
        },
        {
          "line_start": 43,
          "line_end": 43,
          "quote": "権限外は403"
        },
        {
          "line_start": 116,
          "line_end": 116,
          "quote": "金額が10万円未満なら課長、10万円以上なら部長"
        },
        {
          "line_start": 136,
          "line_end": 136,
          "quote": "申請金額が10万円未満の場合に課長が決裁できる。申請金額と決裁者の組合せが合わなければ権限外として403で拒否する。"
        },
        {
          "line_start": 137,
          "line_end": 137,
          "quote": "申請金額が10万円未満なのに課長以外、または10万円以上なのに部長以外が決裁しようとする組合せを権限外として403で拒否する。"
        },
        {
          "line_start": 141,
          "line_end": 141,
          "quote": "申請金額が10万円以上の場合に部長が決裁できる。申請金額と決裁者の組合せが合わなければ権限外として403で拒否する。"
        }
      ]
    },
    {
      "id": "F10",
      "meaning": "approvedまたはrejectedの決定済み申請は再決裁できず、409で拒否する。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 23,
          "line_end": 23,
          "quote": "決定済みは409で拒否する。"
        },
        {
          "line_start": 24,
          "line_end": 24,
          "quote": "決定済みは409で拒否する。"
        },
        {
          "line_start": 25,
          "line_end": 25,
          "quote": "決定済みは409で拒否する。"
        },
        {
          "line_start": 26,
          "line_end": 26,
          "quote": "決定済みは409で拒否する。"
        },
        {
          "line_start": 27,
          "line_end": 27,
          "quote": "決定済みは409で拒否する。"
        },
        {
          "line_start": 28,
          "line_end": 28,
          "quote": "決定済みは409で拒否する。"
        },
        {
          "line_start": 38,
          "line_end": 38,
          "quote": "決定済みは409で拒否する。"
        },
        {
          "line_start": 39,
          "line_end": 39,
          "quote": "決定済みは409で拒否する。"
        },
        {
          "line_start": 40,
          "line_end": 40,
          "quote": "決定済みは409で拒否する。"
        },
        {
          "line_start": 41,
          "line_end": 41,
          "quote": "決定済みは409で拒否する。"
        },
        {
          "line_start": 42,
          "line_end": 42,
          "quote": "決定済みは409で拒否する。"
        },
        {
          "line_start": 43,
          "line_end": 43,
          "quote": "決定済みは409で拒否する。"
        },
        {
          "line_start": 116,
          "line_end": 116,
          "quote": "決定済み申請の再決定拒否"
        },
        {
          "line_start": 139,
          "line_end": 139,
          "quote": "approvedまたはrejectedの決定済み申請は再決裁を409で拒否する。"
        },
        {
          "line_start": 152,
          "line_end": 152,
          "quote": "決裁状態はこれ以上遷移しない。"
        },
        {
          "line_start": 153,
          "line_end": 153,
          "quote": "決裁状態はこれ以上遷移しない。"
        }
      ]
    },
    {
      "id": "F11",
      "meaning": "課長は少額のpending申請を追加の承認条件なしに承認できる。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 29,
          "line_end": 29,
          "quote": "課長が追加の承認条件なしで少額申請を承認し、状態を確定する。"
        },
        {
          "line_start": 30,
          "line_end": 30,
          "quote": "課長が追加の承認条件なしで少額申請を承認し、状態を確定する。"
        },
        {
          "line_start": 31,
          "line_end": 31,
          "quote": "課長が追加の承認条件なしで少額申請を承認し、状態を確定する。"
        },
        {
          "line_start": 32,
          "line_end": 32,
          "quote": "課長が追加の承認条件なしで少額申請を承認し、状態を確定する。"
        },
        {
          "line_start": 33,
          "line_end": 33,
          "quote": "課長が追加の承認条件なしで少額申請を承認し、状態を確定する。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "課長が追加の承認条件なしで少額申請を承認し、状態を確定する。"
        },
        {
          "line_start": 111,
          "line_end": 111,
          "quote": "10万円未満の承認待ち購入申請を確認し、承認または却下を決裁"
        },
        {
          "line_start": 140,
          "line_end": 140,
          "quote": "少額・高額とも追加の承認条件は設けない。"
        },
        {
          "line_start": 148,
          "line_end": 148,
          "quote": "課長が少額申請を承認し"
        }
      ]
    },
    {
      "id": "F12",
      "meaning": "部長は高額のpending申請を追加の承認条件なしに承認できる。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 44,
          "line_end": 44,
          "quote": "部長が追加の承認条件なしで高額申請を承認し、状態を確定する。"
        },
        {
          "line_start": 45,
          "line_end": 45,
          "quote": "部長が追加の承認条件なしで高額申請を承認し、状態を確定する。"
        },
        {
          "line_start": 46,
          "line_end": 46,
          "quote": "部長が追加の承認条件なしで高額申請を承認し、状態を確定する。"
        },
        {
          "line_start": 47,
          "line_end": 47,
          "quote": "部長が追加の承認条件なしで高額申請を承認し、状態を確定する。"
        },
        {
          "line_start": 48,
          "line_end": 48,
          "quote": "部長が追加の承認条件なしで高額申請を承認し、状態を確定する。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "部長が追加の承認条件なしで高額申請を承認し、状態を確定する。"
        },
        {
          "line_start": 112,
          "line_end": 112,
          "quote": "10万円以上の承認待ち購入申請を確認し、承認または却下を決裁"
        },
        {
          "line_start": 140,
          "line_end": 140,
          "quote": "少額・高額とも追加の承認条件は設けない。"
        },
        {
          "line_start": 150,
          "line_end": 150,
          "quote": "部長が高額申請を承認し"
        }
      ]
    },
    {
      "id": "F13",
      "meaning": "pending申請は承認時にapproved、却下時にrejectedへ確定する。少額は課長、高額は部長が却下できる。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 83,
          "line_end": 83,
          "quote": "少額購入申請を却下する@@1.rejected"
        },
        {
          "line_start": 83,
          "line_end": 83,
          "quote": "高額購入申請を却下する@@1.rejected"
        },
        {
          "line_start": 111,
          "line_end": 111,
          "quote": "承認または却下を決裁"
        },
        {
          "line_start": 112,
          "line_end": 112,
          "quote": "承認または却下を決裁"
        },
        {
          "line_start": 116,
          "line_end": 116,
          "quote": "承認または却下する"
        },
        {
          "line_start": 140,
          "line_end": 140,
          "quote": "承認ならapproved、却下ならrejectedに確定し"
        },
        {
          "line_start": 148,
          "line_end": 148,
          "quote": "pending\t少額購入申請を承認する\tapproved"
        },
        {
          "line_start": 149,
          "line_end": 149,
          "quote": "pending\t少額購入申請を却下する\trejected"
        },
        {
          "line_start": 150,
          "line_end": 150,
          "quote": "pending\t高額購入申請を承認する\tapproved"
        },
        {
          "line_start": 151,
          "line_end": 151,
          "quote": "pending\t高額購入申請を却下する\trejected"
        }
      ]
    },
    {
      "id": "F14",
      "meaning": "正常な決裁では200と申請IDおよび決定後の状態を返す。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 34,
          "line_end": 34,
          "quote": "正常時は200と申請IDおよび決定後の状態を返す。"
        },
        {
          "line_start": 35,
          "line_end": 35,
          "quote": "正常時は200と申請IDおよび決定後の状態を返す。"
        },
        {
          "line_start": 36,
          "line_end": 36,
          "quote": "正常時は200と申請IDおよび決定後の状態を返す。"
        },
        {
          "line_start": 37,
          "line_end": 37,
          "quote": "正常時は200と申請IDおよび決定後の状態を返す。"
        },
        {
          "line_start": 49,
          "line_end": 49,
          "quote": "正常時は200と申請IDおよび決定後の状態を返す。"
        },
        {
          "line_start": 50,
          "line_end": 50,
          "quote": "正常時は200と申請IDおよび決定後の状態を返す。"
        },
        {
          "line_start": 51,
          "line_end": 51,
          "quote": "正常時は200と申請IDおよび決定後の状態を返す。"
        },
        {
          "line_start": 52,
          "line_end": 52,
          "quote": "正常時は200と申請IDおよび決定後の状態を返す。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "正常時は200と申請IDおよび決定後の状態を返す。"
        },
        {
          "line_start": 140,
          "line_end": 140,
          "quote": "正常時は200と申請IDおよび決定後の状態を返す。"
        }
      ]
    },
    {
      "id": "F15",
      "meaning": "課長が承認した10万円未満の申請だけを購入対象として引渡す。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 53,
          "line_end": 53,
          "quote": "課長が承認した10万円未満の申請だけを購入対象にする。"
        },
        {
          "line_start": 54,
          "line_end": 54,
          "quote": "課長が承認した10万円未満の申請だけを購入対象にする。"
        },
        {
          "line_start": 55,
          "line_end": 55,
          "quote": "課長が承認した10万円未満の申請だけを購入対象にする。"
        },
        {
          "line_start": 56,
          "line_end": 56,
          "quote": "課長が承認した10万円未満の申請だけを購入対象にする。"
        },
        {
          "line_start": 57,
          "line_end": 57,
          "quote": "課長が承認した10万円未満の申請だけを購入対象にする。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "課長が承認した10万円未満の申請だけを購入対象にする。"
        },
        {
          "line_start": 142,
          "line_end": 142,
          "quote": "10万円未満は課長"
        }
      ]
    },
    {
      "id": "F16",
      "meaning": "部長が承認した10万円以上の申請だけを購入対象として引渡す。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 58,
          "line_end": 58,
          "quote": "部長が承認した10万円以上の申請だけを購入対象にする。"
        },
        {
          "line_start": 59,
          "line_end": 59,
          "quote": "部長が承認した10万円以上の申請だけを購入対象にする。"
        },
        {
          "line_start": 60,
          "line_end": 60,
          "quote": "部長が承認した10万円以上の申請だけを購入対象にする。"
        },
        {
          "line_start": 61,
          "line_end": 61,
          "quote": "部長が承認した10万円以上の申請だけを購入対象にする。"
        },
        {
          "line_start": 62,
          "line_end": 62,
          "quote": "部長が承認した10万円以上の申請だけを購入対象にする。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "部長が承認した10万円以上の申請だけを購入対象にする。"
        },
        {
          "line_start": 142,
          "line_end": 142,
          "quote": "10万円以上は部長が承認した申請"
        }
      ]
    },
    {
      "id": "F17",
      "meaning": "購買担当は承認済み申請のID、物品、金額を確認して購入対象として引き受ける。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 63,
          "line_end": 63,
          "quote": "承認済みの申請ID、物品、金額を購入への引渡し対象として確認する。"
        },
        {
          "line_start": 64,
          "line_end": 64,
          "quote": "承認済みの申請ID、物品、金額を購入への引渡し対象として確認する。"
        },
        {
          "line_start": 65,
          "line_end": 65,
          "quote": "承認済みの申請ID、物品、金額を購入への引渡し対象として確認する。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "承認済みの申請ID、物品、金額を購入への引渡し対象として確認する。"
        },
        {
          "line_start": 113,
          "line_end": 113,
          "quote": "課長または部長が承認した購入申請のID、物品、金額を確認し、購入対象として引き受ける。"
        },
        {
          "line_start": 129,
          "line_end": 129,
          "quote": "承認済みの申請ID、物品、金額を購買担当への引渡し対象とする。"
        },
        {
          "line_start": 142,
          "line_end": 142,
          "quote": "決裁状態がapprovedである申請だけを購買担当への引渡し対象にする。"
        }
      ]
    },
    {
      "id": "F18",
      "meaning": "却下申請は購入対象から除外され、承認待ち申請も引渡し対象ではない。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 37,
          "line_end": 37,
          "quote": "却下された申請は購入対象外"
        },
        {
          "line_start": 52,
          "line_end": 52,
          "quote": "却下された申請は購入対象外"
        },
        {
          "line_start": 57,
          "line_end": 57,
          "quote": "却下または承認待ちの申請を区別できる。"
        },
        {
          "line_start": 62,
          "line_end": 62,
          "quote": "却下または承認待ちの申請を区別できる。"
        },
        {
          "line_start": 116,
          "line_end": 116,
          "quote": "承認済みの申請だけを購買担当への購入引渡し対象とし、却下時は購入しない。"
        },
        {
          "line_start": 142,
          "line_end": 142,
          "quote": "決裁状態がapprovedである申請だけを購買担当への引渡し対象にする。"
        },
        {
          "line_start": 149,
          "line_end": 149,
          "quote": "購入対象から除外する。"
        },
        {
          "line_start": 151,
          "line_end": 151,
          "quote": "購入対象から除外する。"
        }
      ]
    },
    {
      "id": "F19",
      "meaning": "購入実行と結果連絡は今回の対象外である。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 63,
          "line_end": 63,
          "quote": "購入実行と結果連絡は対象外。"
        },
        {
          "line_start": 64,
          "line_end": 64,
          "quote": "購入実行と結果連絡は対象外。"
        },
        {
          "line_start": 65,
          "line_end": 65,
          "quote": "購入実行と結果連絡は対象外。"
        },
        {
          "line_start": 102,
          "line_end": 102,
          "quote": "購入実行と結果連絡は対象外。"
        },
        {
          "line_start": 116,
          "line_end": 116,
          "quote": "購入実行と結果連絡は今回のAPI実装範囲外とする。"
        },
        {
          "line_start": 142,
          "line_end": 142,
          "quote": "購入実行と結果連絡は対象外。"
        }
      ]
    },
    {
      "id": "F20",
      "meaning": "購入申請には申請ID、申請者社員ID、物品名、金額、決裁状態、決裁者社員IDを持たせ、社員情報と関連付ける。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 89,
          "line_end": 89,
          "quote": "購入申請@@申請ID、申請者社員ID、物品名、金額、決裁状態、決裁者社員ID"
        },
        {
          "line_start": 90,
          "line_end": 90,
          "quote": "購入申請@@社員情報"
        },
        {
          "line_start": 129,
          "line_end": 129,
          "quote": "申請ID、申請者社員ID、物品名、金額、決裁状態、決裁者社員ID\t社員情報"
        }
      ]
    },
    {
      "id": "F21",
      "meaning": "社員情報は社員ID、氏名、役割を持つマスターで、申請者と決裁者の識別および課長・部長の決裁権限確認に用いる。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 89,
          "line_end": 89,
          "quote": "社員情報@@社員ID、氏名、役割"
        },
        {
          "line_start": 93,
          "line_end": 93,
          "quote": "社員情報@@申請者および決裁者となる社員を識別し、課長・部長の役割に応じた決裁権限の確認に用いるマスター情報。"
        },
        {
          "line_start": 130,
          "line_end": 130,
          "quote": "社員ID、氏名、役割"
        },
        {
          "line_start": 130,
          "line_end": 130,
          "quote": "申請者および決裁者となる社員を識別し、課長・部長の役割に応じた決裁権限の確認に用いるマスター情報。"
        }
      ]
    },
    {
      "id": "F22",
      "meaning": "申請金額区分は10万円未満と10万円以上、決裁者区分は課長と部長、申請状態区分は審査待ち・承認・却下である。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 80,
          "line_end": 80,
          "quote": "申請金額区分@@10万円未満、10万円以上//決裁者区分@@課長、部長//申請状態区分@@審査待ち、承認、却下"
        },
        {
          "line_start": 120,
          "line_end": 120,
          "quote": "10万円未満、10万円以上"
        },
        {
          "line_start": 121,
          "line_end": 121,
          "quote": "課長、部長"
        },
        {
          "line_start": 122,
          "line_end": 122,
          "quote": "審査待ち、承認、却下"
        }
      ]
    },
    {
      "id": "F23",
      "meaning": "既存の公開REST APIとPostgreSQLスキーマを維持し、TypeScriptで申請入力検証、権限に応じた決定、再決定拒否を扱う。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 116,
          "line_end": 116,
          "quote": "既存の公開REST APIとPostgreSQLスキーマを維持する。TypeScriptで申請入力の検証、権限に応じた決定、決定済み申請の再決定拒否を扱う。"
        }
      ]
    },
    {
      "id": "F24",
      "meaning": "申請画面で物品・金額を入力し、少額か高額かと高額時の部長決裁対象を確認できる。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 5,
          "line_end": 5,
          "quote": "物品と金額を入力して申請でき、10万円未満の申請であることを確認できる。"
        },
        {
          "line_start": 17,
          "line_end": 17,
          "quote": "物品と金額を入力して申請でき、10万円以上の申請は部長の決裁対象となることを確認できる。"
        },
        {
          "line_start": 106,
          "line_end": 106,
          "quote": "物品と金額を入力して申請でき、10万円未満の申請であることを確認できる。"
        },
        {
          "line_start": 106,
          "line_end": 106,
          "quote": "物品と金額を入力して申請でき、10万円以上の申請は部長の決裁対象となることを確認できる。"
        }
      ]
    },
    {
      "id": "F25",
      "meaning": "申請画面は入力時に金額・物品名の制約を示し、不正な項目と理由を修正できるようにする。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 8,
          "line_end": 8,
          "quote": "金額は0以上の整数、物品名は空欄不可であることを入力時に示し、不正な項目と理由を修正できる。"
        },
        {
          "line_start": 106,
          "line_end": 106,
          "quote": "金額は0以上の整数、物品名は空欄不可であることを入力時に示し、不正な項目と理由を修正できる。"
        }
      ]
    },
    {
      "id": "F26",
      "meaning": "申請画面は提出した物品と金額を確定前に確認させ、登録後の承認待ち状態を示す。高額では部長の承認待ちと示す。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 11,
          "line_end": 11,
          "quote": "提出した物品と金額を確認して確定でき、登録後は承認待ちであることが分かる。"
        },
        {
          "line_start": 21,
          "line_end": 21,
          "quote": "提出した物品と金額を確認して確定でき、部長の承認待ちとして登録されたことが分かる。"
        },
        {
          "line_start": 106,
          "line_end": 106,
          "quote": "提出した物品と金額を確認して確定でき、登録後は承認待ちであることが分かる。"
        },
        {
          "line_start": 106,
          "line_end": 106,
          "quote": "提出した物品と金額を確認して確定でき、部長の承認待ちとして登録されたことが分かる。"
        }
      ]
    },
    {
      "id": "F27",
      "meaning": "受付画面で申請IDと承認待ち状態、受付失敗時には理由を確認できる。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 14,
          "line_end": 14,
          "quote": "受付後に申請IDと承認待ちの状態を確認でき、受付できなかった場合は理由を確認できる。"
        },
        {
          "line_start": 106,
          "line_end": 106,
          "quote": "受付後に申請IDと承認待ちの状態を確認でき、受付できなかった場合は理由を確認できる。"
        }
      ]
    },
    {
      "id": "F28",
      "meaning": "少額・高額の申請確認画面はIDで検索し、物品・金額・状態を表示し、該当金額帯かつpendingのみ決裁可能とし、対象なし・権限外・決定済みの理由を示す。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 28,
          "line_end": 28,
          "quote": "申請IDで対象を探し、物品・金額・状態を確認できる。10万円未満かつ承認待ちの対象だけを決裁可能とし、対象なし・権限外・決定済みの理由を示す。"
        },
        {
          "line_start": 43,
          "line_end": 43,
          "quote": "申請IDで対象を探し、物品・金額・状態を確認できる。10万円以上かつ承認待ちの対象だけを決裁可能とし、対象なし・権限外・決定済みの理由を示す。"
        },
        {
          "line_start": 106,
          "line_end": 106,
          "quote": "10万円未満かつ承認待ちの対象だけを決裁可能とし"
        },
        {
          "line_start": 106,
          "line_end": 106,
          "quote": "10万円以上かつ承認待ちの対象だけを決裁可能とし"
        }
      ]
    },
    {
      "id": "F29",
      "meaning": "決裁画面は物品・金額・承認待ち状態を確認して承認選択でき、確定前に決裁内容を再確認できる。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 33,
          "line_end": 33,
          "quote": "対象の物品・金額・承認待ち状態を確認したうえで承認を選択し、確定前に決裁内容を再確認できる。"
        },
        {
          "line_start": 48,
          "line_end": 48,
          "quote": "対象の物品・金額・承認待ち状態を確認したうえで承認を選択し、確定前に決裁内容を再確認できる。"
        },
        {
          "line_start": 106,
          "line_end": 106,
          "quote": "対象の物品・金額・承認待ち状態を確認したうえで承認を選択し、確定前に決裁内容を再確認できる。"
        }
      ]
    },
    {
      "id": "F30",
      "meaning": "決裁結果画面では決裁者が申請ID、承認または却下の確定結果、再決裁不可を確認でき、社員は自分の申請IDと決裁結果および却下時の購入対象外を確認できる。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 36,
          "line_end": 36,
          "quote": "決裁した申請IDと承認または却下の確定結果を確認でき、再決裁できないことが分かる。"
        },
        {
          "line_start": 37,
          "line_end": 37,
          "quote": "自分の申請IDと承認または却下の決裁結果を確認でき、却下された申請は購入対象外と分かる。"
        },
        {
          "line_start": 51,
          "line_end": 51,
          "quote": "決裁した申請IDと承認または却下の確定結果を確認でき、再決裁できないことが分かる。"
        },
        {
          "line_start": 52,
          "line_end": 52,
          "quote": "自分の申請IDと承認または却下の決裁結果を確認でき、却下された申請は購入対象外と分かる。"
        },
        {
          "line_start": 106,
          "line_end": 106,
          "quote": "決裁した申請IDと承認または却下の確定結果を確認でき、再決裁できないことが分かる。"
        },
        {
          "line_start": 106,
          "line_end": 106,
          "quote": "自分の申請IDと承認または却下の決裁結果を確認でき、却下された申請は購入対象外と分かる。"
        }
      ]
    },
    {
      "id": "F31",
      "meaning": "少額・高額購入対象画面では各決裁者は自分が承認した申請の物品・金額・IDを、購買担当は承認済み引渡し対象と却下・承認待ちの区別を確認できる。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 56,
          "line_end": 56,
          "quote": "自分が承認した10万円未満の申請だけを物品・金額・申請IDとともに確認できる。"
        },
        {
          "line_start": 57,
          "line_end": 57,
          "quote": "課長が承認した10万円未満の申請だけを引渡し対象として確認でき、却下または承認待ちの申請を区別できる。"
        },
        {
          "line_start": 61,
          "line_end": 61,
          "quote": "自分が承認した10万円以上の申請だけを物品・金額・申請IDとともに確認できる。"
        },
        {
          "line_start": 62,
          "line_end": 62,
          "quote": "部長が承認した10万円以上の申請だけを引渡し対象として確認でき、却下または承認待ちの申請を区別できる。"
        },
        {
          "line_start": 106,
          "line_end": 106,
          "quote": "自分が承認した10万円未満の申請だけを物品・金額・申請IDとともに確認できる。"
        },
        {
          "line_start": 106,
          "line_end": 106,
          "quote": "自分が承認した10万円以上の申請だけを物品・金額・申請IDとともに確認できる。"
        }
      ]
    },
    {
      "id": "F32",
      "meaning": "購買担当の購入対象確認画面は承認済み申請のID・物品・金額・決裁結果を一覧と詳細で示し、引渡し対象を識別できる。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 65,
          "line_end": 65,
          "quote": "承認済み申請のID・物品・金額・決裁結果を一覧と詳細で確認し、購入への引渡し対象を識別できる。"
        },
        {
          "line_start": 106,
          "line_end": 106,
          "quote": "承認済み申請のID・物品・金額・決裁結果を一覧と詳細で確認し、購入への引渡し対象を識別できる。"
        }
      ]
    },
    {
      "id": "F33",
      "meaning": "申請・決裁・購買担当の各アクターはいずれも社内で、各部門に社員・課長・部長、購買部門に承認済申請確認担当者を置く。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 69,
          "line_end": 69,
          "quote": "各部門@@購入申請社員//各部門@@少額購入決裁課長//各部門@@高額購入決裁部長//購買部門@@承認済申請確認担当者"
        },
        {
          "line_start": 110,
          "line_end": 110,
          "quote": "各部門\t購入申請社員"
        },
        {
          "line_start": 110,
          "line_end": 110,
          "quote": "社内"
        },
        {
          "line_start": 111,
          "line_end": 111,
          "quote": "各部門\t少額購入決裁課長"
        },
        {
          "line_start": 111,
          "line_end": 111,
          "quote": "社内"
        },
        {
          "line_start": 112,
          "line_end": 112,
          "quote": "各部門\t高額購入決裁部長"
        },
        {
          "line_start": 112,
          "line_end": 112,
          "quote": "社内"
        },
        {
          "line_start": 113,
          "line_end": 113,
          "quote": "購買部門\t承認済申請確認担当者"
        },
        {
          "line_start": 113,
          "line_end": 113,
          "quote": "社内"
        }
      ]
    }
  ],
  "questions": [],
  "contradictions": [],
  "additional_human_inputs": [],
  "limitations": []
}
