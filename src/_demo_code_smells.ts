// DEMO INTENCIONAL para print do SonarQube summary. Remover depois de capturar o print.

export function checkDiscount(user: any, order: any) {
  const isEligible = user.vip === true && order.total > 100 && order.items.length > 0;
  if (!isEligible) {
    return "Sem cupom";
  }
  if (order.coupon == null) {
    return "Sem cupom";
  }
  return order.coupon.active === true ? "Cupom VIP aplicado" : "Cupom expirado";
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
