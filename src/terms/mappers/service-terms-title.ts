export const userAgreeTitle = (lang: string, target: string, division: string) => {
    if (target === 'JOIN') {
        // 회원가입
        if (division === 'MARKETING') {
            // 마케팅 활용 및 광고성 정보수신에 대한 동의
            if (lang === 'KO') {
                return '마케팅 활용 및 광고성 정보수신에 대한 동의';
            } else if (lang === 'EN') {
                return 'Consent to the use of personal information for marketing purposes';
            } else if (lang === 'JA') {
                return '個人情報のマーケティング活用に対する同意';
            } else if (lang === 'ZNCN') {
                return '同意将隐私信息用于市场营销活动';
            } else if (lang === 'ZNTW') {
                return '同意將隱私信息用於市場營銷活動';
            }
        } else if (division === 'PRIVACY') {
            // 개인정보 수집 및 이용에 대한 동의
            if (lang === 'KO') {
                return '개인정보 수집 및 이용에 관한 동의';
            } else if (lang === 'EN') {
                return 'Consent to the collection and use of personal information';
            } else if (lang === 'JA') {
                return '個人情報の収集・利用に対する同意';
            } else if (lang === 'ZNCN') {
                return '同意隐私信息的收集及使用';
            } else if (lang === 'ZNTW') {
                return '同意隱私信息的收集及使用';
            }
        } else if (division === 'PRIVACY_THIRD') {
            // 개인정보 제 3자 제공 및 이용에 대한 동의
            if (lang === 'KO') {
                return '개인정보 제 3자 제공 및 이용에 관한 동의';
            } else if (lang === 'EN') {
                return 'Consent to third-party provision (sharing) and use of personal information';
            } else if (lang === 'JA') {
                return '個人情報の第三者への提供・利用に対する同意';
            } else if (lang === 'ZNCN') {
                return '同意向第三方提供隐私信息';
            } else if (lang === 'ZNTW') {
                return '同意向第三方提供隱私信息';
            }
        } else if (division === 'REWARDS_MBRSHP') {
            // 파라다이스시티 리워즈 회원 이용약관
            if (lang === 'KO') {
                return '파라다이스 리워즈 회원 이용약관';
            } else if (lang === 'EN') {
                return 'Terms and conditions of Paradise Rewards membership';
            } else if (lang === 'JA') {
                return 'パラダイス・リワーズ会員利用規約';
            } else if (lang === 'ZNCN') {
                return '「Paradise Rewards」会员计划条款';
            } else if (lang === 'ZNTW') {
                return '「Paradise Rewards」會員計劃條款';
            }
        } else if (division === 'AGREEMENT') {
            // 파라다이스시티 리워즈 앱 이용약관
            if (lang === 'KO') {
                return '앱 이용약관';
            } else if (lang === 'EN') {
                return 'Terms and conditions of App';
            } else if (lang === 'JA') {
                return 'アプリ利用規約';
            } else if (lang === 'ZNCN') {
                return '应用程序使用条款';
            } else if (lang === 'ZNTW') {
                return '應用程序使用條款';
            }
        }
    } else if (target === 'GROUP') {
        // 회원가입
        // 마케팅 활용 및 광고성 정보수신에 대한 동의
        if (division === 'INTG_MARKETING') {
            // 마케팅 활용 및 광고성 정보수신에 대한 동의

            if (lang === 'KO') {
                return '마케팅 활용 및 광고성 정보수신에 대한 동의';
            } else if (lang === 'EN') {
                return 'Consent to the use of personal information for marketing purposes';
            } else if (lang === 'JA') {
                return '個人情報のマーケティング活用に対する同意';
            } else if (lang === 'ZNCN') {
                return '同意将隐私信息用于市场营销活动';
            } else if (lang === 'ZNTW') {
                return '同意將隱私信息用於市場營銷活動';
            }
        } else if (['INTG_PRIVACY', 'INTG_PRIVACY_SEL'].includes(division)) {
            // 개인정보 수집 및 이용에 대한 동의
            if (lang === 'KO') {
                return '개인정보 수집 및 이용에 대한 동의';
            } else if (lang === 'EN') {
                return 'Consent to the collection and use of personal information';
            } else if (lang === 'JA') {
                return '個人情報の収集・利用に対する同意';
            } else if (lang === 'ZNCN') {
                return '同意隐私信息的收集及使用';
            } else if (lang === 'ZNTW') {
                return '同意隱私信息的收集及使用';
            }
        } else if (division === 'INTG_PRIVACY_THIRD') {
            // 개인정보 제 3자 제공 및 이용에 대한 동의
            if (lang === 'KO') {
                return '개인정보 제3자 제공에 대한 동의';
            } else if (lang === 'EN') {
                return 'Consent to third-party provision (sharing) and use of personal information';
            } else if (lang === 'JA') {
                return '個人情報の第三者への提供・利用に対する同意';
            } else if (lang === 'ZNCN') {
                return '同意向第三方提供隐私信息';
            } else if (lang === 'ZNTW') {
                return '同意向第三方提供隱私信息';
            }
        } else if (division === 'INTG_AGREEMENT') {
            // 앱 이용약관
            // 파라다이스시티 리워즈 앱 이용약관
            if (lang === 'KO') {
                return '파라다이스시티 리워즈 회원 이용약관';
            } else if (lang === 'EN') {
                return 'Terms and conditions of App';
            } else if (lang === 'JA') {
                return 'アプリ利用規約';
            } else if (lang === 'ZNCN') {
                return '应用程序使用条款';
            } else if (lang === 'ZNTW') {
                return '應用程序使用條款';
            }
            // 위치정보 수집 및 이용에 대한 동의
        } else if (['INTG_LOC_INFO', 'LOCATION'].includes(division)) {
            if (lang === 'KO') {
                return '위치정보 수집 및 이용에 대한 동의';
            } else if (lang === 'EN') {
                return 'Consent to the collection and use of location information';
            } else if (lang === 'JA') {
                return '位置情報の収集及び利用に関する同意';
            } else if (lang === 'ZNCN') {
                return '同意收集和利用位置信息';
            } else if (lang === 'ZNTW') {
                return '同意收集和利用位置信息';
            }
        }
    } else if (target === 'PAYMENT') {
        // 오퍼(OFFER) 결제
        if (['PRIVACY', 'OFFER_PRIVACY_LOGIN', 'OFFER_PRIVACY'].includes(division)) {
            // 개인정보 수집 및 이용에 대한 동의
            if (lang === 'KO') {
                return '개인정보 수집 및 이용에 관한 동의';
            } else if (lang === 'EN') {
                return 'Consent to the collection and use of personal information';
            } else if (lang === 'JA') {
                return '個人情報の収集・利用に対する同意';
            } else if (lang === 'ZNCN') {
                return '同意隐私信息的收集及使用';
            } else if (lang === 'ZNTW') {
                return '同意隱私信息的收集及使用';
            }
        } else if (['CANCEL', 'OFFER_PRIVACY_REFUND'].includes(division)) {
            // 취소 환불 수수료에 대한 동의

            if (lang === 'KO') {
                return '취소 환불 수수료에 관한 동의';
            } else if (lang === 'EN') {
                return 'Agree to the policies on cancellation, refund and cancellation fees';
            } else if (lang === 'JA') {
                return 'キャンセル・返金手数料ポリシーに対する同意';
            } else if (lang === 'ZNCN') {
                return '同意取消及退款政策';
            } else if (lang === 'ZNTW') {
                return '同意取消及退款政策';
            }
        }
    } else if (target === 'DINING_PAYMENT') {
        // 다이닝(DINING) 결제

        if (division === 'PRV_DINING') {
            // 개인정보 수집 및 이용에 대한 동의
            if (lang === 'KO') {
                return '개인정보 수집 및 이용에 관한 동의';
            } else if (lang === 'EN') {
                return 'Consent to the collection and use of personal information';
            } else if (lang === 'JA') {
                return '個人情報の収集・利用に対する同意';
            } else if (lang === 'ZNCN') {
                return '同意隐私信息的收集及使用';
            } else if (lang === 'ZNTW') {
                return '同意隱私信息的收集及使用';
            }
        } else if (division === 'PRV_DINING_RFD') {
            // 취소 환불 수수료에 대한 동의
            if (lang === 'KO') {
                return '취소 환불 수수료에 관한 동의';
            } else if (lang === 'EN') {
                return 'Agree to the policies on cancellation, refund and cancellation fees';
            } else if (lang === 'JA') {
                return '予約のキャンセル・返金手数料ポリシーに対する同意';
            } else if (lang === 'ZNCN') {
                return '同意取消及退款政策';
            } else if (lang === 'ZNTW') {
                return '同意取消及退款政策';
            }
        }
    } else if (target === 'CASINO') {
        // 카지노(CASINO) 사전등록
        switch (division) {
            case 'INTG_CSN_AGREEMENT': {
                switch (lang) {
                    case 'KO':
                        return '이용약관';
                    case 'EN':
                        return 'Terms and Conditions';
                    case 'JA':
                        return '利用約款';
                    case 'ZNCN':
                        return '使用条款';
                    case 'ZNTW':
                        return '使用條款';
                }
                break;
            }
            case 'INTG_CSN_PRIVACY': {
                switch (lang) {
                    case 'KO':
                        return '개인정보 수집 및 이용에 대한 동의(필수)';
                    case 'EN':
                        return 'Consent to collection and use of personal information';
                    case 'JA':
                        return '個人情報の収集・利用に対する同意';
                    case 'ZNCN':
                        return '同意隐私信息的收集及使用';
                    case 'ZNTW':
                        return '同意隱私信息的收集及使用';
                }
                break;
            }
            case 'INTG_CSN_SPC_GBINFO': {
                switch (lang) {
                    case 'KO':
                        return '고유식별정보 수집 및 이용에 대한 동의(필수)';
                    case 'EN':
                        return 'Consent to collection and use of unique identification information';
                    case 'JA':
                        return '固有識別情報の収集・利用に対する同意';
                    case 'ZNCN':
                        return '同意个人独有识别信息的收集及使用';
                    case 'ZNTW':
                        return '同意個人獨有識別信息的收集及使用';
                }
                break;
            }
            case 'INTG_CSN_PRIVACY_THIRD': {
                switch (lang) {
                    case 'KO':
                        return '개인정보 제3자 제공에 대한 동의(필수)';
                    case 'EN':
                        return 'Consent to provision of personal information to third parties';
                    case 'JA':
                        return '個人情報の第三者への提供に対する同意';
                    case 'ZNCN':
                        return '同意向第三方提供隐私信息';
                    case 'ZNTW':
                        return '同意向第三方提供隱私信息';
                }
                break;
            }
            case 'INTG_CSN_MARKETING': {
                switch (lang) {
                    case 'KO':
                        return '개인정보 마케팅 활용에 대한 동의(선택)';
                    case 'EN':
                        return 'Consent to use of personal information for marketing purpose';
                    case 'JA':
                        return '個人情報のマーケティング活用に対する同意';
                    case 'ZNCN':
                        return '同意将隐私信息用于市场营销活动';
                    case 'ZNTW':
                        return '同意將隱私信息用於市場營銷活動';
                }
                break;
            }
            case 'INTG_CSN_SENSITIVE_INFO': {
                switch (lang) {
                    case 'KO':
                        return '민감정보 수집 및 이용에 대한 동의(필수)';
                    case 'EN':
                        return 'Consent to collection and use of sensitive information';
                    case 'JA':
                        return '機微情報の収集・利用に対する同意';
                    case 'ZNCN':
                        return '同意敏感信息的收集及使用';
                    case 'ZNTW':
                        return '同意敏感信息的收集及使用';
                }
                break;
            }
        }
    }
    return '';
};
