package com.yin.yin.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 分页结果类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResult<T> {
    /**
     * 总记录数
     */
    private Long total;

    /**
     * 数据列表
     */
    private List<T> list;
}
