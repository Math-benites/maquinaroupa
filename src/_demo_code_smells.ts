// DEMO INTENCIONAL para print do SonarQube summary. Remover depois de capturar o print.

export function checkDiscount(user: any, order: any) {
  let msg = "";
  if (user.vip == true) {
    if (order.total > 100) {
      if (order.items.length > 0) {
        if (order.coupon != null) {
          if (order.coupon.active == true) {
            msg = "Cupom VIP aplicado";
          } else {
            msg = "Cupom expirado";
          }
        } else {
          msg = "Sem cupom";
        }
      } else {
        msg = "Sem cupom";
      }
    } else {
      msg = "Sem cupom";
    }
  } else {
    msg = "Sem cupom";
  }
  return msg;
}

export function loadUserPrefs(raw: string) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
  }
  return parsed;
}

export function unusedHelper() {
  return "Sem cupom";
}
