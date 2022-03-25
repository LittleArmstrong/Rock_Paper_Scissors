export function get_random_int(min, max) {
  min = Math.floor(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function show_choice_roulette(
  tag_id,
  choice_list,
  choice_index,
  min = 0,
  max = choice_list.length
) {
  txt_choice = document.getElementById(tag_id);
  txt_choice.textContent = choice_list[min];
}

export function $(x) {
  return document.getElementById(x);
}
