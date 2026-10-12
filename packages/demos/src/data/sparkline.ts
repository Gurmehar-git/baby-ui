/** Two weeks of daily revenue in thousands, and a second week to morph to. */
export const SPARK_REVENUE = [
	8.2, 8.9, 8.4, 9.6, 10.1, 9.8, 11.2, 10.7, 11.9, 12.6, 12.1, 13.4, 12.9, 14.2,
];
export const SPARK_REVENUE_NEXT = [
	9.1, 8.6, 9.9, 10.4, 9.7, 10.8, 12.2, 11.5, 12.8, 12.3, 13.9, 13.1, 14.6, 15.3,
];
export const SPARK_DAYS = Array.from({ length: 14 }, (_, index) => `Oct ${index + 1}`);
export const formatThousands = (value: number) => `$${value.toFixed(1)}k`;
