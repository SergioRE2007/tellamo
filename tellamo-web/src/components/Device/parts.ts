export type PartId = 'A' | 'B' | 'C' | 'D' | 'E'
export type LedId = 'enviado' | 'entendido' | 'sin-conexion'

/** x / y are the callout badge centres in the illustration's 720 × 520 viewBox. */
export const PARTS: { id: PartId; title: string; detail: string; x: number; y: number }[] = [
  {
    id: 'A',
    title: 'Seis botones grandes en dos filas',
    detail: 'Uno por frase. Tienen recorrido y un clic que se nota al pulsar.',
    x: 40,
    y: 278,
  },
  {
    id: 'B',
    title: 'Tarjeta intercambiable',
    detail: 'Con una foto o un pictograma. Se cambia cuando cambia la frase.',
    x: 164,
    y: 50,
  },
  {
    id: 'C',
    title: 'Tira de luz de estado',
    detail: 'Un color para cada cosa que le pasa al aviso.',
    x: 280,
    y: 50,
  },
  {
    id: 'D',
    title: 'Altavoz con la voz de la familia',
    detail: 'Dice la frase en voz alta con la voz grabada de un familiar.',
    x: 700,
    y: 306,
  },
  {
    id: 'E',
    title: 'Base antideslizante con peso',
    detail: 'La caja se queda en su sitio aunque se pulse con fuerza.',
    x: 280,
    y: 470,
  },
]

export const LEDS: {
  id: LedId
  label: string
  colour: string
  meaning: string
  fill: string
  bg: string
  text: string
}[] = [
  {
    id: 'enviado',
    label: 'Enviado',
    colour: 'Ámbar',
    meaning: 'El aviso ha salido hacia el móvil de la familia.',
    fill: 'fill-amber',
    bg: 'bg-amber',
    text: 'text-amber-ink',
  },
  {
    id: 'entendido',
    label: 'Te han entendido',
    colour: 'Verde',
    meaning: 'Alguien ha respondido «Voy» o «Te llamo» desde la app.',
    fill: 'fill-green',
    bg: 'bg-green',
    text: 'text-green-ink',
  },
  {
    id: 'sin-conexion',
    label: 'Sin conexión',
    colour: 'Rojo',
    meaning: 'La caja no tiene conexión y el aviso no puede salir.',
    fill: 'fill-red',
    bg: 'bg-red',
    text: 'text-red-ink',
  },
]
